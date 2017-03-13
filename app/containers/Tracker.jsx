/* global window */
import React, { PropTypes, Component } from 'react';
import mergeImages from 'merge-images';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import getScreen from 'user-media-screenshot';
import fs from 'fs';
import NanoTimer from 'nanotimer';
import electron, { remote, ipcRenderer } from 'electron';
import { idleTimeThreshold, activityInterval } from 'config';

import Flex from '../components/Base/Flex/Flex';
import Timer from '../components/Timer/Timer';
import TrackerHeader from '../components/TrackerHeader/TrackerHeader';
import Updater from './Updater';
import StatusBar from './StatusBar';

import { getTrackingIssue, getSelectedIssue, getSettings } from '../selectors/';

import * as trackerActions from '../actions/tracker';
import * as worklogsActions from '../actions/worklogs';
import * as issuesActions from '../actions/issues';
import * as uiActions from '../actions/ui';

const system = remote.require('@paulcbetts/system-idle-time');

let timeRange = 60;
let lastIdleTime = 0;
let idleTime = 0;

class Tracker extends Component {
  static propTypes = {
    trackingIssue: PropTypes.object,
    self: PropTypes.object,
    currentIssue: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    currentWorklogId: PropTypes.number,
    time: PropTypes.number.isRequired,
    running: PropTypes.bool.isRequired,
    paused: PropTypes.bool.isRequired,
    description: PropTypes.string,
    descriptionPopupOpen: PropTypes.bool.isRequired,
    rejectScreenshot: PropTypes.func.isRequired,
    acceptScreenshot: PropTypes.func.isRequired,
    startTimer: PropTypes.func.isRequired,
    pauseTimer: PropTypes.func.isRequired,
    unpauseTimer: PropTypes.func.isRequired,
    stopTimer: PropTypes.func.isRequired,
    tick: PropTypes.func.isRequired,
    closeDescriptionPopup: PropTypes.func.isRequired,
    openDescriptionPopup: PropTypes.func.isRequired,
    selectIssue: PropTypes.func.isRequired,
    updateWorklog: PropTypes.func.isRequired,
    addRecentWorklog: PropTypes.func.isRequired,
    idleState: PropTypes.bool.isRequired,
    setIdleState: PropTypes.func.isRequired,
    dismissIdleTime: PropTypes.func.isRequired,
    addRecentIssue: PropTypes.func.isRequired,
    uploading: PropTypes.bool.isRequired,
    screensShot: PropTypes.object.isRequired,
    setDescription: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    ipcRenderer.on('force-save', (e, time) => {
      if (window.confirm('Tracking in progress, save worklog before quit?')){
        this.handleTimerStop()
          .then(
            () => ipcRenderer.send('ready-to-quit')
          );
      }
    });
    ipcRenderer.on('dismissIdleTime', (e, time) => {
      const seconds = Math.ceil(time / 1000);
      if (this.props.time > seconds) {
        this.props.dismissIdleTime(seconds);
      }
    });
    ipcRenderer.on('dismissAndRestart', (e, time) => {
      const seconds = Math.ceil(time / 1000);
      const { trackingIssue } = this.props;
      if (this.props.time > seconds) {
        this.props.dismissIdleTime(seconds);
        this.handleTimerStop();
        this.props.startTimer('', trackingIssue);
      }
    });
    ipcRenderer.on('screenshot-reject', () => this.props.rejectScreenshot());
    ipcRenderer.on('screenshot-accept', () => {
      const { getGlobal } = remote;
      const { screenshotTime, lastScreenshotPath } = getGlobal('sharedObj');
      const { interval, dispersion } = this.props.settings.toJS();

      this.props.acceptScreenshot(screenshotTime, lastScreenshotPath);
      timeRange = screenshotTime + Math.ceil(
        Number(interval) + ((Math.random() *
        (Number(dispersion) + Number(dispersion))) - Number(dispersion)),
      );
    });
    this.state = {
      idleTime: 0,
      lastIdleTime: 0,
      totalIdleTime: 0,
    };
    this.timer = new NanoTimer();
    this.activityTimer = new NanoTimer();
    this.activityPercentageTimer = new NanoTimer();
  }

  componentWillReceiveProps(nextProps) {
    const { getGlobal } = remote;
    if (!this.props.running && nextProps.running) {
      this.timer.setInterval(() => this.tick(), '', '1s');
      this.activityTimer.setInterval(() => this.checkActivity(), '', '1s');
      this.activityPercentageTimer.setInterval(() => this.calculateActiviy(), '', `${activityInterval}s`);
      getGlobal('sharedObj').running = true;
    }
    if (this.props.running && !nextProps.running) {
      this.timer.clearInterval();
      this.activityTimer.clearInterval();
      this.activityPercentageTimer.clearInterval();
    }
  }

  calculateActiviy = () => {
    const { idleTime, totalIdleTime } = this.state;
    let time = totalIdleTime + idleTime;
    time = time > activityInterval * 1000 ? activityInterval * 1000 : time;
    const activityPercent = (1 - (time / (activityInterval * 1000))).toFixed(2) * 100
    console.log(`${activityPercent}%`)
    this.props.addActivityPercent(activityPercent);
    this.setState({
      totalIdleTime: 0,
    });
  }

  checkActivity = () => {
    const { idleState, setIdleState } = this.props;
    let { idleTime, lastIdleTime, totalIdleTime } = this.state;
    lastIdleTime = idleTime;
    idleTime = system.getIdleTime();
    if (idleTime > idleTimeThreshold * 1000 && !idleState) {
      setIdleState(true);
    }
    if (idleTime < idleTimeThreshold * 1000 && idleState) {
      setIdleState(false);
      this.openIdleTimePopup(lastIdleTime);
    }
    if (idleTime < 1000) {
      totalIdleTime += lastIdleTime;
    }
    this.setState({
      totalIdleTime,
      idleTime,
      lastIdleTime,
    });
  }

  handleTimerStop = () => new Promise((resolve) => {
    const {
      stopTimer,
      updateWorklog,
      clearTrackingIssue,
      addRecentIssue,
      addRecentWorklog,
      resetTimer,
      time,
      description,
      trackingIssue,
      updateIssueTime,
      screensShot,
    } = this.props;

    const { getGlobal } = remote;

    stopTimer();
    updateWorklog({
      time,
      description,
      issueId: trackingIssue.get('id'),
      screensShot: screensShot.toJS(),
    })
      .then(
        worklog => {
          clearTrackingIssue();
          addRecentIssue(worklog.issueId);
          addRecentWorklog(worklog);
          updateIssueTime(worklog.issueId, worklog.timeSpentSeconds);
          resetTimer();
          getGlobal('sharedObj').running = false;
          resolve();
        },
        (err) => {
          clearTrackingIssue();
          resetTimer();
          getGlobal('sharedObj').running = false;
          resolve();
        }
      );
  });

  tick = () => {
    const { tick, time } = this.props;
    tick();
    if (time === 1) {
      const { settings } = this.props;
      const {
        interval,
        dispersion,
      } = settings.toJS();
      console.log(settings.toJS());
      timeRange = Math.ceil(
        Number(interval) + ((Math.random() *
          (Number(dispersion) + Number(dispersion))) - Number(dispersion)),
      );
      console.log(timeRange);
    }
    if ((time + 1) % timeRange === 0) {
      const { self, settings } = this.props;
      const selfKey = self.get('key');
      const {
        screenshotsEnabled, screenshotsEnabledUsers, interval, dispersion,
      } = settings.toJS();
      const cond1 = screenshotsEnabled === 'everyone';
      const cond2 = screenshotsEnabled === 'forUsers' &&
        screenshotsEnabledUsers.includes(selfKey);
      const cond3 = screenshotsEnabled === 'excludingUsers' &&
        !screenshotsEnabledUsers.includes(selfKey);
      if ((cond1 || cond2 || cond3) && !this.props.idleState) {
        this.openScreenShotPopup();
      } else {
        timeRange = time + Math.ceil(
          Number(interval) + ((Math.random() *
          (Number(dispersion) + Number(dispersion))) - Number(dispersion)),
        );
      }
    }
  }

  openScreenShotPopup = () => {
    const { BrowserWindow, getGlobal } = remote;
    const { currentWorklogId, time } = this.props;
    const dir = getGlobal('appDir');
    const srcDir = getGlobal('appSrcDir');
    const screenshotTime = time;
    getScreen((images) => {
      let xPointer = 0;
      let totalWidth = 0;
      let maxHeight = 0;
      const imagesWithCords = images.map((image, i) => {
        const _image = new Image();
        _image.src = image;
        const imageObj = {
          src: image,
          x: xPointer,
          y: 0,
        }
        xPointer = _image.naturalWidth + xPointer;
        totalWidth += _image.naturalWidth;
        maxHeight = _image.naturalHeight > maxHeight ? _image.naturalHeight : maxHeight;
        return imageObj;
      })
      mergeImages(imagesWithCords, { width: totalWidth, height: maxHeight })
        .then(
          (merged) => {
            const validImage = merged.replace(/^data:image\/png;base64,/, '');
            const imageDir = `${dir}/screenshots/${screenshotTime}_${Date.now()}.png`;
            fs.writeFile(imageDir, validImage, 'base64', (err) => {
              getGlobal('sharedObj').lastScreenshotPath = imageDir;
              getGlobal('sharedObj').currentWorklogId = currentWorklogId;
              getGlobal('sharedObj').screenshotTime = screenshotTime;
              if (err) throw err;
              const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
              const options = {
                width: 218,
                height: 212,
                x: width - 218,
                y: height - 212,
                frame: false,
                resizable: false,
                movable: false,
                alwaysOnTop: true,
              };
              const win = new BrowserWindow(options);
              win.loadURL(`file://${srcDir}/popup.html`);
            });
          }
        )
    });
  }

  openIdleTimePopup = (time) => {
    const { BrowserWindow, getGlobal } = remote;
    getGlobal('sharedObj').idleTime = time;
    const dir = getGlobal('appSrcDir');
    const options = {
      width: 250,
      height: 112,
      frame: false,
    };
    const win = new BrowserWindow(options);
    win.loadURL(`file://${dir}/idlePopup.html`);
  }

  render() {
    const {
      running, paused, time, trackingIssue, startTimer, closeDescriptionPopup, description,
      pauseTimer, unpauseTimer, openDescriptionPopup, descriptionPopupOpen, currentIssue,
      selectIssue, uploading, setDescription,
    } = this.props;
    return (
      <Flex column className="tracker">
        <TrackerHeader currentIssue={currentIssue} />
        <Timer
          running={running}
          uploading={uploading}
          paused={paused}
          time={time}
          trackingIssue={trackingIssue}
          currentIssue={currentIssue}
          setCurrentIssue={selectIssue}
          onStart={() => startTimer()}
          onPause={pauseTimer}
          description={description}
          onUnPause={unpauseTimer}
          onStop={this.handleTimerStop}
          onDescriptionChange={setDescription}
        />
        <StatusBar />
      </Flex>
    );
  }
}

function mapStateToProps({ jira, tracker, ui, issues, settings }) {
  return {
    self: jira.self,
    currentIssue: getSelectedIssue({ issues }),
    trackingIssue: getTrackingIssue({ issues }),
    screensShot: tracker.screensShot,
    time: tracker.time,
    running: tracker.running,
    paused: tracker.paused,
    currentWorklogId: tracker.currentWorklogId,
    settings: getSettings({ settings }),
    descriptionPopupOpen: ui.descriptionPopupOpen,
    description: tracker.description,
    idleState: ui.idleState,
    uploading: tracker.uploading,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...trackerActions,
    ...uiActions,
    ...issuesActions,
    ...worklogsActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Tracker);
