/* global window */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import getScreen from 'user-media-screenshot';
import fs from 'fs';
import { remote, ipcRenderer } from 'electron';

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
    currentIssue: state.get('context').currentIssue,
    trackingIssue: getTrackingIssue({ context: state.get('context'), tracker: state.get('tracker')}),
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
  }

  constructor(props) {
    super(props);
    ipcRenderer.on('screenshot-reject', () => {
      this.props.rejectScreenshot();
    });
    ipcRenderer.on('screenshot-accept', () => {
      const { getGlobal } = remote;
      const { screenshotTime, lastScreenshotPath } = getGlobal('sharedObj');

      this.props.acceptScreenshot(screenshotTime, lastScreenshotPath);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.running && nextProps.running) {
      this.timerLoop = setInterval(() => this.tick(), 930);
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
      const { tick, time, settings } = this.props;
      const { interval, dispersion } = settings.toJS();
      tick();
      if (time === 1) {
        timeRange = Math.ceil(
          Number(interval) + ((Math.random() *
            (Number(dispersion) + Number(dispersion))) - Number(dispersion)),
        );
      }
      if ((time + 1) % timeRange === 0) {
        this.openScreenShotPopup();
      }
    }
  }

  openScreenShotPopup = () => {
    const { BrowserWindow, getGlobal } = remote;
    const { currentWorklogId, time, settings } = this.props;
    const { interval, dispersion } = settings.toJS();
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
        const options = {
          width: 400,
          height: 300,
          x: window.screen.width - 400,
          y: window.screen.height - 300,
          frame: false,
          transparent: true,
          resizable: false,
          movable: false,
          alwaysOnTop: true,
        };
        const win = new BrowserWindow(options);
        win.loadURL(`file://${dir}/src/popup.html`);
        // timeRange = Math.ceil(10 + Math.random() * (5 + 5) - 5);
        timeRange = Math.ceil(
          Number(interval) + ((Math.random() *
          (Number(dispersion) + Number(dispersion))) - Number(dispersion)),
        );
        // timeRange = Math.ceil(600 + Math.random() * (120 + 120) - 120);
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
