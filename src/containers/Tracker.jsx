/* global window */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import getScreen from 'user-media-screenshot';
import fs from 'fs';
import NanoTimer from 'nanotimer';
import electron, { remote, ipcRenderer } from 'electron';

import Flex from '../components/Base/Flex/Flex';
import Timer from '../components/Timer/Timer';
import TrackerHeader from '../components/TrackerHeader/TrackerHeader';

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
  }

  constructor(props) {
    super(props);
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
    this.timer = new NanoTimer();
    this.activityTimer = new NanoTimer();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.running && nextProps.running) {
      this.timer.setInterval(() => this.tick(), '', '1s');
      this.activityTimer.setInterval(() => this.checkActivity(), '', '1s');
    }
    if (this.props.running && !nextProps.running) {
      this.timer.clearInterval();
      this.activityTimer.clearInterval();
    }
  }

  checkActivity = () => {
    const { idleState, setIdleState } = this.props;
    lastIdleTime = idleTime;
    idleTime = system.getIdleTime();
    if (idleTime > 300000 && !idleState) {
      setIdleState(true);
    }
    if (idleTime < 300000 && idleState) {
      setIdleState(false);
      this.openIdleTimePopup(lastIdleTime);
    }
  }

  handleTimerStop = () => {
    this.props.updateWorklog()
      .then(
        worklog => {
          this.props.stopTimer();
          this.props.addRecentIssue(worklog.issueId);
          this.props.addRecentWorklog(worklog);
        }
      );
  }

  tick = () => {
    if (!this.props.paused) {
      const { tick, time } = this.props;
      tick();
      if (time === 1) {
        const { settings } = this.props;
        const {
          interval,
          dispersion,
        } = settings.toJS();
        timeRange = Math.ceil(
          Number(interval) + ((Math.random() *
            (Number(dispersion) + Number(dispersion))) - Number(dispersion)),
        );
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
        if (cond1 || cond2 || cond3) {
          this.openScreenShotPopup();
        } else {
          timeRange = time + Math.ceil(
            Number(interval) + ((Math.random() *
            (Number(dispersion) + Number(dispersion))) - Number(dispersion)),
          );
        }
      }
    }
  }

  openScreenShotPopup = () => {
    const { BrowserWindow, getGlobal } = remote;
    const { currentWorklogId, time } = this.props;
    const dir = getGlobal('appDir');
    const screenshotTime = time;
    getScreen((image) => {
      const validImage = image.replace(/^data:image\/jpeg;base64,/, '');
      const imageDir = `${dir}/screenshots/${screenshotTime}_${Date.now()}.jpeg`;
      fs.writeFile(imageDir, validImage, 'base64', (err) => {
        getGlobal('sharedObj').lastScreenshotPath = imageDir;
        getGlobal('sharedObj').currentWorklogId = currentWorklogId;
        getGlobal('sharedObj').screenshotTime = screenshotTime;
        if (err) throw err;
        const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
        const options = {
          width: 400,
          height: 300,
          x: width - 400,
          y: height - 300,
          frame: false,
          transparent: true,
          resizable: false,
          movable: false,
          alwaysOnTop: true,
        };
        const win = new BrowserWindow(options);
        win.loadURL(`file://${dir}/src/popup.html`);
      });
    });
  }

  openIdleTimePopup = (time) => {
    const { BrowserWindow, getGlobal } = remote;
    getGlobal('sharedObj').idleTime = time;
    const dir = getGlobal('appDir');
    const options = {
      width: 300,
      height: 200,
      frame: false,
    };
    const win = new BrowserWindow(options);
    win.loadURL(`file://${dir}/src/idlePopup.html`);
  }

  render() {
    const {
      running, paused, time, trackingIssue, startTimer, closeDescriptionPopup, description,
      pauseTimer, unpauseTimer, openDescriptionPopup, descriptionPopupOpen, currentIssue,
      selectIssue,
    } = this.props;
    return (
      <Flex column className="tracker">
        <TrackerHeader currentIssue={currentIssue} />
        <Timer
          running={running}
          paused={paused}
          time={time}
          trackingIssue={trackingIssue}
          currentIssue={currentIssue}
          setCurrentIssue={selectIssue}
          onStart={openDescriptionPopup}
          onPause={pauseTimer}
          description={description}
          onUnPause={unpauseTimer}
          onStop={this.handleTimerStop}
          descPopupOpen={descriptionPopupOpen}
          onDescPopupClose={closeDescriptionPopup}
          onDescPopupConfirm={(desc) => {
            closeDescriptionPopup();
            startTimer(desc);
          }}
        />
      </Flex>
    );
  }
}

function mapStateToProps({ jira, tracker, ui, issues, settings }) {
  return {
    self: jira.self,
    currentIssue: getSelectedIssue({ issues }),
    trackingIssue: getTrackingIssue({ issues }),
    time: tracker.time,
    running: tracker.running,
    paused: tracker.paused,
    currentWorklogId: tracker.currentWorklogId,
    settings: getSettings({ settings }),
    descriptionPopupOpen: ui.descriptionPopupOpen,
    description: tracker.description,
    idleState: ui.idleState,
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
