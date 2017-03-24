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

import Flex from '../../components/Base/Flex/Flex';
import Timer from '../../components/Timer/Timer';
import TrackerHeader from '../../components/TrackerHeader/TrackerHeader';
import StatusBar from './StatusBar';

import { getTrackingIssue, getSelectedIssue } from '../../selectors';

import * as timerActions from '../../actions/timer';
import * as worklogsActions from '../../actions/worklogs';
import * as issuesActions from '../../actions/issues';
import * as uiActions from '../../actions/ui';

const system = remote.require('@paulcbetts/system-idle-time');

let timeRange = 60;
let lastIdleTime = 0;
let idleTime = 0;

class Tracker extends Component {
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
    selectIssue: PropTypes.func.isRequired,
    createWorklog: PropTypes.func.isRequired,
    addRecentWorklog: PropTypes.func.isRequired,
    idleState: PropTypes.bool.isRequired,
    setIdleState: PropTypes.func.isRequired,
    dismissIdleTime: PropTypes.func.isRequired,
    addRecentIssue: PropTypes.func.isRequired,
    uploading: PropTypes.bool.isRequired,
    screensShot: PropTypes.object.isRequired,
    setDescription: PropTypes.func.isRequired,
    submitUnfinishedWorklog: PropTypes.func.isRequired,
  }

  componentDidMount() {
    ipcRenderer.on('screenshot-accept', this.acceptScreenshot);
    ipcRenderer.on('screenshot-reject', this.rejectScreenshot);

    ipcRenderer.on('force-save', this.forceSave);
    ipcRenderer.on('dismissIdleTime', this.dismissIdleTime);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('screenshot-accept', this.acceptScreenshot);
    ipcRenderer.removeListener('screenshot-reject', this.rejectScreenshot);

    ipcRenderer.removeListener('force-save', this.forceSave);
    ipcRenderer.removeListener('dismissIdleTime', this.dismissIdleTime);
  }

  acceptScreenshot = () => {
    const { getGlobal } = remote;
    const { screenshotTime, lastScreenshotPath } = getGlobal('sharedObj');
    this.props.uploadScreenshot({ screenshotTime, lastScreenshotPath });
  }

  rejectScreenshot = () => {
    const { getGlobal } = remote;
    const { screenshotTime, lastScreenshotPath } = getGlobal('sharedObj');
    this.props.cutIddlesFromLastScreenshot();
    this.props.rejectScreenshot(lastScreenshotPath);
  }

  forceSave = () => {
    const { getGlobal } = remote;
    const { running, uploading } = getGlobal('sharedObj');

    if (running && window.confirm('Tracking in progress, save worklog before quit?')) {
      this.props.setForceQuitFlag();
      this.props.stopTimer();
    }
    if (uploading) {
      window.alert('Currently app in process of saving worklog, wait few seconds please');
    }
  }

  dismissIdleTime = (ev, time) => {
    const seconds = Math.ceil(time / 1000);
    this.props.cutIddles(Math.ceil(seconds/60));
    this.props.dismissIdleTime(seconds);
  }

  render() {
    const {
      running, paused, time, trackingIssue, startTimer, closeDescriptionPopup, description,
      pauseTimer, unpauseTimer, openDescriptionPopup, descriptionPopupOpen, currentIssue,
      selectIssue, uploading, setDescription, stopTimer,
    } = this.props;

    if (!currentIssue.size) {
      return (
        <Flex column className="tracker">
          <Flex column centered className="timer">
            <Flex row centered>
              select an issue from the list on the left
            </Flex>
          </Flex>
        </Flex>
      );
    }

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
          startTimer={startTimer}
          stopTimer={stopTimer}
          description={description}
          onUnPause={unpauseTimer}
          onDescriptionChange={setDescription}
        />
        <StatusBar />
      </Flex>
    );
  }
}

function mapStateToProps({ timer, ui, issues, settings, worklogs }) {
  return {
    currentIssue: getSelectedIssue({ issues }),
    trackingIssue: getTrackingIssue({ issues }),
    screensShot: timer.screensShot,
    time: timer.time,
    running: timer.running,
    paused: timer.paused,
    currentWorklogId: timer.currentWorklogId,
    settings,
    descriptionPopupOpen: ui.descriptionPopupOpen,
    description: timer.description,
    idleState: ui.idleState,
    uploading: worklogs.meta.worklogUploading,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...timerActions,
    ...uiActions,
    ...issuesActions,
    ...worklogsActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Tracker);
