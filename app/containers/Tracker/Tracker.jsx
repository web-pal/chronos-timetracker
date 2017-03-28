import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { remote, ipcRenderer } from 'electron';

import Flex from '../../components/Base/Flex/Flex';
import TimerControls from '../../components/Timer/TimerControls';
import TimerDisplay from './TimerDisplay';
import TrackerHeader from '../../components/TrackerHeader/TrackerHeader';
import StatusBar from './StatusBar';

import { getSelectedIssue, getTrackingIssue, getIssueLoggedByUser } from '../../selectors';

import * as timerActions from '../../actions/timer';
import * as worklogsActions from '../../actions/worklogs';
import * as issuesActions from '../../actions/issues';


class Tracker extends Component {
  static propTypes = {
    uploadScreenshot: PropTypes.func.isRequired,
    rejectScreenshot: PropTypes.func.isRequired,

    cutIddlesFromLastScreenshot: PropTypes.func.isRequired,
    cutIddles: PropTypes.func.isRequired,
    dismissIdleTime: PropTypes.func.isRequired,

    startTimer: PropTypes.func.isRequired,
    stopTimer: PropTypes.func.isRequired,
    selectIssue: PropTypes.func.isRequired,
    setForceQuitFlag: PropTypes.func.isRequired,
    setDescription: PropTypes.func.isRequired,

    running: PropTypes.bool.isRequired,
    currentIssue: ImmutablePropTypes.map.isRequired,
    currentTrackingIssue: ImmutablePropTypes.map.isRequired,
    description: PropTypes.string.isRequired,
    currentIssueSelfLogged: PropTypes.number.isRequired,
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
    const { lastScreenshotPath } = getGlobal('sharedObj');
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
    this.props.cutIddles(Math.ceil(seconds / 60));
    this.props.dismissIdleTime(seconds);
  }

  render() {
    const {
      startTimer, stopTimer, selectIssue, setDescription,
      running, currentIssue, currentTrackingIssue, description, currentIssueSelfLogged,
    } = this.props;

    if (!currentIssue.size) {
      return (
        <Flex column className="tracker">
          <Flex column centered className="timer">
            <Flex row centered>
              select an issue from the list on the left
            </Flex>
          </Flex>
          <StatusBar />
        </Flex>
      );
    }

    return (
      <Flex column className="tracker">
        <TrackerHeader currentIssue={currentIssue} selfLogged={currentIssueSelfLogged} />
        <Flex column centered className="timer">
          {(currentTrackingIssue.size > 0) &&
            <Flex
              column
              className={[
                'current-tracking',
                `${currentTrackingIssue.get('id') !== currentIssue.get('id') ? 'show' : 'hide'}`,
              ].join(' ')}
            >
              <Flex row centered>
                Currently tracking
                <span className="current-tracking__key">
                  {currentTrackingIssue.get('key')}
                </span>
              </Flex>
              <Flex row centered>
                <span
                  className="current-tracking__link"
                  onClick={() => selectIssue(currentTrackingIssue.get('id'))}
                >
                  Jump to issue
                </span>
              </Flex>
            </Flex>
          }
          {running &&
            <Flex row centered>
              <input
                autoFocus
                id="descriptionInput"
                value={description}
                className="descriptionInput"
                onChange={e => setDescription(e.target.value)}
                placeholder="What are you doing?"
              />
            </Flex>
          }
          <Flex row centered>
            <Flex column>
              <TimerControls
                running={running}
                startTimer={startTimer}
                stopTimer={stopTimer}
              />
              <TimerDisplay />
            </Flex>
          </Flex>
        </Flex>
        <StatusBar />
      </Flex>
    );
  }
}

function mapStateToProps({ timer, issues, worklogs, profile }) {
  return {
    running: timer.running,
    currentIssue: getSelectedIssue({ issues }),
    currentIssueSelfLogged: getIssueLoggedByUser({ issues, worklogs, profile }),
    currentTrackingIssue: getTrackingIssue({ issues, worklogs }),
    description: worklogs.meta.currentDescription,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...worklogsActions,
    ...timerActions,
    ...issuesActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Tracker);
