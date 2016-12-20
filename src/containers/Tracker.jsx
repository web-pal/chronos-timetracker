/* global window */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import getScreen from 'user-media-screenshot';
import fs from 'fs';
import electron, { remote, ipcRenderer } from 'electron';

import Flex from '../components/Base/Flex/Flex';
import Timer from '../components/Timer/Timer';
import TrackerHeader from '../components/TrackerHeader/TrackerHeader';

import { getTrackingIssue } from '../selectors/issues';

import * as trackerActions from '../actions/tracker';
import * as uiActions from '../actions/ui';
import * as contextActions from '../actions/context';

let timeRange = 60;

function mapStateToProps(state) {
  return {
    self: state.get('jira').get('self'),
    currentIssue: state.get('context').currentIssue,
    trackingIssue: getTrackingIssue({ context: state.get('context'), tracker: state.get('tracker') }),
    time: state.get('tracker').time,
    running: state.get('tracker').running,
    paused: state.get('tracker').paused,
    currentWorklogId: state.get('tracker').currentWorklogId,
    settings: state.get('context').settings,
    descriptionPopupOpen: state.get('ui').descriptionPopupOpen,
    description: state.get('tracker').description,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...trackerActions, ...uiActions, ...contextActions }, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Tracker extends Component {
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
    setCurrentIssue: PropTypes.func.isRequired,
    updateWorklog: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    ipcRenderer.on('screenshot-reject', () => {
      this.props.rejectScreenshot();
    });
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
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.running && nextProps.running) {
      this.timerLoop = setInterval(() => this.tick(), 1000);
    }
    if (this.props.running && !nextProps.running) {
      clearInterval(this.timerLoop);
    }
  }

  handleTimerStart = () => this.props.startTimer();

  handleTimerPause = () => this.props.pauseTimer();

  handleTimerStop = () => this.props.stopTimer();

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
          this.props.updateWorklog();
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

  render() {
    const {
      running, paused, time, trackingIssue, startTimer, closeDescriptionPopup, description,
      pauseTimer, unpauseTimer, stopTimer, openDescriptionPopup, descriptionPopupOpen, currentIssue,
      setCurrentIssue,
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
          setCurrentIssue={setCurrentIssue}
          onStart={openDescriptionPopup}
          onPause={pauseTimer}
          description={description}
          onUnPause={unpauseTimer}
          onStop={stopTimer}
          descPopupOpen={descriptionPopupOpen}
          onDescPopupClose={closeDescriptionPopup}
          onDescPopupConfirm={(desc) => {
            closeDescriptionPopup();
            startTimer(desc);
            remote.BrowserWindow.getFocusedWindow().hide();
          }}
        />
      </Flex>
    );
  }
}
