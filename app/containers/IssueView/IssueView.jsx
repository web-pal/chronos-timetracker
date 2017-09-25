import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { remote, ipcRenderer } from 'electron';

import Flex from '../../components/Base/Flex/Flex';

import IssueHeader from './IssueHeader/IssueHeader';
import Tabs from './Tabs/Tabs';
import Details from './Details/Details';
import Comments from './Comments/Comments';
import Worklogs from './Worklogs/Worklogs';
// import Statistics from './Statistics/Statistics';

import TrackingBar from './TrackingBar/TrackingBar';
import TrackingView from '../TrackingView/TrackingView';

import {
  getSelectedIssue, getTrackingIssue, getIssueLoggedByUser,
  getIssueLoggedByUserToday, getIssueLoggedToday,
} from '../../selectors';

import * as timerActions from '../../actions/timer';
import * as worklogsActions from '../../actions/worklogs';
import * as issuesActions from '../../actions/issues';
import * as uiActions from '../../actions/ui';

const tabs = [
  { label: 'Details', content: <Details /> },
  { label: 'Comments', content: <Comments /> },
  { label: 'Worklogs', content: <Worklogs /> },
  // { label: 'Report', content: <Statistics /> },
];

const IssueViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const IssueContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 1px solid rgba(0,0,0,0.18);
`;

const IssueViewTabContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 20px 0px 20px;
  overflow-y: auto;
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
    setForceQuitFlag: PropTypes.func.isRequired,
    saveKeepedIdle: PropTypes.func.isRequired,

    running: PropTypes.bool.isRequired,
    currentIssue: ImmutablePropTypes.map.isRequired,
    currentTrackingIssue: ImmutablePropTypes.map.isRequired,
    currentIssueSelfLogged: PropTypes.number.isRequired,
    currentIssueSelfLoggedToday: PropTypes.number.isRequired,
    currentIssueLoggedToday: PropTypes.number.isRequired,

    issueViewTab: PropTypes.string.isRequired,
    setIssueViewTab: PropTypes.func.isRequired,
  }

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

  changeIssueViewTab = (newTab) => {
    this.props.setIssueViewTab(newTab);
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

    // eslint-disable-next-line no-alert
    if (running && window.confirm('Tracking in progress, save worklog before quit?')) {
      this.props.setForceQuitFlag();
      this.props.stopTimer();
    }
    if (uploading) {
      // eslint-disable-next-line no-alert
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
      startTimer,
      running,
      currentIssue,
      currentTrackingIssue,
      currentIssueSelfLogged,
      currentIssueSelfLoggedToday,
      currentIssueLoggedToday,
      issueViewTab,
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

    return (
      <IssueViewContainer column className="tracker">
        {running &&
          <TrackingBar />
        }
        <TrackingView />
        <IssueContainer>
          <IssueHeader
            currentIssue={currentIssue}
            currentTrackingIssue={currentTrackingIssue}
            running={running}
            startTimer={startTimer}
          />
          <Tabs
            tabs={tabs}
            activeTab={issueViewTab}
            onChangeTab={this.changeIssueViewTab}
          />
          <IssueViewTabContainer>
            {issueViewTab === 'Details' &&
              <Details
                currentIssue={currentIssue}
              />
            }
            {issueViewTab === 'Comments' &&
              <Comments />
            }
            {issueViewTab === 'Worklogs' &&
              <Worklogs />
            }
            {/*
            issueViewTab === 'Report' &&
              <Statistics
                currentIssueSelfLogged={currentIssueSelfLogged}
                currentIssueSelfLoggedToday={currentIssueSelfLoggedToday}
                currentIssueLoggedToday={currentIssueLoggedToday}
              />
            */}
          </IssueViewTabContainer>
        </IssueContainer>
      </IssueViewContainer>
    );
  }
}

function mapStateToProps({ timer, issues, worklogs, profile, ui }) {
  return {
    running: timer.running,
    currentIssue: getSelectedIssue({ issues }),
    currentIssueSelfLogged: getIssueLoggedByUser({ issues, worklogs, profile }),
    currentIssueSelfLoggedToday: getIssueLoggedByUserToday({ issues, worklogs, profile }),
    currentIssueLoggedToday: getIssueLoggedToday({ issues, worklogs }),
    currentTrackingIssue: getTrackingIssue({ issues, worklogs }),
    issueViewTab: ui.issueViewTab,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...worklogsActions,
    ...timerActions,
    ...issuesActions,
    ...uiActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueView);
