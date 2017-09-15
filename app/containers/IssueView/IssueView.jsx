// TODO: delete state from component
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
import Statistics from './Statistics/Statistics';

import TrackingBar from './TrackingBar/TrackingBar';
import TrackingView from '../TrackingView/TrackingView';

import {
  getSelectedIssue, getTrackingIssue, getIssueLoggedByUser,
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
    saveKeepedIdle: PropTypes.func.isRequired,

    running: PropTypes.bool.isRequired,
    screenshotUploading: PropTypes.bool.isRequired,
    currentIssue: ImmutablePropTypes.map.isRequired,
    currentTrackingIssue: ImmutablePropTypes.map.isRequired,
    currentIssueSelfLogged: PropTypes.number.isRequired,
    currentIssueSelfLoggedToday: PropTypes.number.isRequired,
    currentIssueLoggedToday: PropTypes.number.isRequired,
  }

  // TODO: delete state from this component
  state = { activeTab: 'Details', isTrackingView: false }

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
      startTimer, stopTimer, selectIssue, jumpToTrackingIssue, running, screenshotUploading,
      currentIssue, currentTrackingIssue, currentIssueSelfLogged, currentIssueSelfLoggedToday,
      currentIssueLoggedToday,
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
          <TrackingBar
            toggleTrackingView={() => this.setState({ isTrackingView: !this.state.isTrackingView })}
            isTrackingView={this.state.isTrackingView}
            startTimer={startTimer}
            stopTimer={stopTimer}
            running={running}
            screenshotUploading={screenshotUploading}
            currentTrackingIssue={currentTrackingIssue}
            selectIssue={selectIssue}
            jumpToTrackingIssue={jumpToTrackingIssue}
          />
        }
        <TrackingView isActive={this.state.isTrackingView} />
        <Flex column style={{ borderLeft: '1px solid rgba(0,0,0,0.18)' }}>
          <IssueHeader
            currentIssue={currentIssue}
            currentTrackingIssue={currentTrackingIssue}
            running={running}
            startTimer={startTimer}
          />
          <Tabs
            tabs={tabs}
            activeTab={this.state.activeTab}
            onChangeTab={(newTab) => this.setState({ activeTab: newTab })}
          />
          <Flex column style={{ padding: '20px 20px 0px 20px', overflowY: 'auto' }}>
            {this.state.activeTab === 'Details' &&
              <Details
                currentIssue={currentIssue}
              />
            }
            {this.state.activeTab === 'Comments' &&
              <Comments />
            }
            {this.state.activeTab === 'Worklogs' &&
              <Worklogs />
            }
            {this.state.activeTab === 'Report' &&
              <Statistics
                currentIssueSelfLogged={currentIssueSelfLogged}
                currentIssueSelfLoggedToday={currentIssueSelfLoggedToday}
                currentIssueLoggedToday={currentIssueLoggedToday}
              />
            }
          </Flex>
        </Flex>
      </IssueViewContainer>
    );
  }
}

function mapStateToProps({ timer, issues, worklogs, profile }) {
  return {
    running: timer.running,
    screenshotUploading: worklogs.meta.screenshotUploading,
    currentIssue: getSelectedIssue({ issues }),
    currentIssueSelfLogged: getIssueLoggedByUser({ issues, worklogs, profile }),
    currentIssueSelfLoggedToday: getIssueLoggedByUserToday({ issues, worklogs, profile }),
    currentIssueLoggedToday: getIssueLoggedToday({ issues, worklogs }),
    currentTrackingIssue: getTrackingIssue({ issues, worklogs }),
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
