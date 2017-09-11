import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { remote, ipcRenderer } from 'electron';

// import TextareaAutosize from 'react-autosize-textarea';
import Flex from '../../components/Base/Flex/Flex';
// import TimerControls from '../../components/Timer/TimerControls';
// import TimerDisplay from './TimerDisplay';
// import TrackerHeader from '../../components/TrackerHeader/TrackerHeader';
// import StatusBar from './StatusBar';
// import Gallery from '../../components/Gallery/Gallery';
// import WorklogTypePicker from '../ComponentsWrappers/WorklogTypePickerWrapper';

import IssueHeader from './IssueHeader/IssueHeader';
import Tabs from './Tabs/Tabs';
import Details from './Details/Details';
import Comments from './Comments/Comments';
import Worklogs from './Worklogs/Worklogs';
import Statistics from './Statistics/Statistics';

import {
  getSelectedIssue, getSelectedWorklog,
  getTrackingIssue, getIssueLoggedByUser,
  getIssueLoggedByUserToday, getIssueLoggedToday,
} from '../../selectors';

import * as timerActions from '../../actions/timer';
import * as worklogsActions from '../../actions/worklogs';
import * as issuesActions from '../../actions/issues';

const tabs = [
  { label: 'Details', content: <Details /> },
  { label: 'Comments', content: <Comments /> },
  { label: 'Worklogs', content: <Worklogs /> },
  { label: 'Report', content: <Statistics /> },
];

const IssueViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 1px solid rgba(0, 0, 0, 0.18);
  height: 100vh;
`;

class IssueView extends Component {
  static propTypes = {
    uploadScreenshot: PropTypes.func.isRequired,
    rejectScreenshot: PropTypes.func.isRequired,

    cutIddlesFromLastScreenshot: PropTypes.func.isRequired,
    cutIddles: PropTypes.func.isRequired,
    dismissIdleTime: PropTypes.func.isRequired,
    normalizeScreenshotsPeriods: PropTypes.func.isRequired,

    startTimer: PropTypes.func.isRequired,
    stopTimer: PropTypes.func.isRequired,
    selectIssue: PropTypes.func.isRequired,
    jumpToTrackingIssue: PropTypes.func.isRequired,
    setForceQuitFlag: PropTypes.func.isRequired,
    setDescription: PropTypes.func.isRequired,
    saveKeepedIdle: PropTypes.func.isRequired,

    running: PropTypes.bool.isRequired,
    screenshotUploading: PropTypes.bool.isRequired,
    showWorklogTypes: PropTypes.bool.isRequired,
    currentIssue: ImmutablePropTypes.map.isRequired,
    currentWorklog: ImmutablePropTypes.map.isRequired,
    currentTrackingIssue: ImmutablePropTypes.map.isRequired,
    currentWorklogType: PropTypes.number,
    screenshots: ImmutablePropTypes.orderedSet.isRequired,
    description: PropTypes.string.isRequired,
    currentIssueSelfLogged: PropTypes.number.isRequired,
    currentIssueSelfLoggedToday: PropTypes.number.isRequired,
    currentIssueLoggedToday: PropTypes.number.isRequired,
    sidebarType: PropTypes.string.isRequired,

    deleteScreenshotRequest: PropTypes.func.isRequired,
    time: PropTypes.number.isRequired,
  }

  static defaultProps = {
    currentWorklogType: null,
  }

  state = { activeTab: 'Details' }

  // TODO: delete state from this component
  onChangeTab = (newTab) => this.setState({ activeTab: newTab });

  componentDidMount() {
    ipcRenderer.on('screenshot-accept', this.acceptScreenshot);
    ipcRenderer.on('screenshot-reject', this.rejectScreenshot);

    ipcRenderer.on('force-save', this.forceSave);
    ipcRenderer.on('dismissIdleTime', this.dismissIdleTime);
    ipcRenderer.on('keepIdleTime', this.keepIdleTime);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('screenshot-accept', this.acceptScreenshot);
    ipcRenderer.removeListener('screenshot-reject', this.rejectScreenshot);

    ipcRenderer.removeListener('force-save', this.forceSave);
    ipcRenderer.removeListener('dismissIdleTime', this.dismissIdleTime);
    ipcRenderer.removeListener('keepIdleTime', this.keepIdleTime);
  }

  acceptScreenshot = () => {
    const { getGlobal } = remote;
    const {
      screenshotTime,
      timestamp,
      lastScreenshotPath,
      lastScreenshotThumbPath,
    } = getGlobal('sharedObj');
    this.props.uploadScreenshot({
      screenshotTime,
      lastScreenshotPath,
      lastScreenshotThumbPath,
      timestamp,
    });
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

  keepIdleTime = () => {
    const { getGlobal } = remote;
    const { idleDetails } = getGlobal('sharedObj');
    this.props.saveKeepedIdle(idleDetails);
    this.props.normalizeScreenshotsPeriods();
  }

  render() {
    const {
      startTimer, stopTimer, selectIssue, jumpToTrackingIssue, setDescription,
      running, screenshotUploading, description, screenshots, deleteScreenshotRequest,
      currentIssue, currentWorklog, currentWorklogType, currentTrackingIssue,
      currentIssueSelfLogged, currentIssueSelfLoggedToday, currentIssueLoggedToday,
      time, sidebarType, showWorklogTypes,
    } = this.props;

    if (!currentIssue.size) {
      return (
        <Flex column className="tracker">
          <Flex column centered className="timer">
            <Flex row centered>
              Select an issue from the list on the left
            </Flex>
          </Flex>
        </Flex>
      );
    }
    console.log(this.state.activeTab);

    return (
      <IssueViewContainer column className="tracker">
        <IssueHeader
          currentIssue={currentIssue}
          currentWorklog={currentWorklog}
          sidebarType={sidebarType}
          loggedToday={currentIssueLoggedToday}
          selfLogged={currentIssueSelfLogged}
          selfLoggedToday={currentIssueSelfLoggedToday}
          showWorklogTypes={showWorklogTypes}
          running={running}
        />
        <Tabs
          tabs={tabs}
          activeTab={this.state.activeTab}
          onChangeTab={this.onChangeTab}
        />
        <Flex column style={{ padding: '20px 20px 0px 20px', overflowY: 'auto' }}>
          {/* tabs.find(i => i.label === this.state.activeTab).content */}
          <Details
            currentIssue={currentIssue}
            currentWorklog={currentWorklog}
            sidebarType={sidebarType}
            loggedToday={currentIssueLoggedToday}
            selfLogged={currentIssueSelfLogged}
            selfLoggedToday={currentIssueSelfLoggedToday}
            showWorklogTypes={showWorklogTypes}
            running={running}
          />
        </Flex>
        {/*
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
                  onClick={() => {
                    selectIssue(currentTrackingIssue.get('id'));
                    jumpToTrackingIssue();
                  }}
                >
                  Jump to issue
                </span>
              </Flex>
            </Flex>
          }
          <Flex row centered style={{ minHeight: 10, height: 60 }}>
            {running &&
              <TextareaAutosize
                autoFocus
                id="descriptionInput"
                value={description}
                style={{ minHeight: 15, maxHeight: 180 }}
                className="descriptionInput"
                onChange={e => setDescription(e.target.value)}
                placeholder="What are you doing?"
              />
            }
          </Flex>
          <Flex row centered style={{ marginBottom: 10 }}>
            {(running && showWorklogTypes) &&
              <WorklogTypePicker currentWorklogType={currentWorklogType} />
            }
          </Flex>
          <Flex row centered>
            <Flex column style={{ width: '100%' }}>
              <TimerControls
                running={running}
                screenshotUploading={screenshotUploading}
                startTimer={startTimer}
                stopTimer={stopTimer}
              />
              <TimerDisplay />
              {running && time < 60 &&
                <Flex row centered className="TimerControls__warning">
                  Time under 1m would not be logged!
                </Flex>
              }
              <Gallery images={screenshots} deleteScreenshot={deleteScreenshotRequest} />
            </Flex>
          </Flex>
        </Flex>
        <StatusBar />
        */}
      </IssueViewContainer>
    );
  }
}

function mapStateToProps({ timer, issues, worklogs, ui, profile }) {
  return {
    running: timer.running,
    time: timer.time,
    screenshotUploading: worklogs.meta.screenshotUploading,
    currentIssue: getSelectedIssue({ issues }),
    currentWorklog: getSelectedWorklog({ worklogs }),
    currentIssueSelfLogged: getIssueLoggedByUser({ issues, worklogs, profile }),
    currentIssueSelfLoggedToday: getIssueLoggedByUserToday({ issues, worklogs, profile }),
    currentIssueLoggedToday: getIssueLoggedToday({ issues, worklogs }),
    currentTrackingIssue: getTrackingIssue({ issues, worklogs }),
    currentWorklogType: worklogs.meta.currentWorklogType,
    description: worklogs.meta.currentDescription,
    screenshots: issues.meta.currentScreenshots,
    sidebarType: ui.sidebarType,
    showWorklogTypes: worklogs.meta.showWorklogTypes,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...worklogsActions,
    ...timerActions,
    ...issuesActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueView);
