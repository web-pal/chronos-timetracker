// @flow
import React, { Component } from 'react';
import type { Element } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getSelectedIssueId, getIssueViewTab } from 'selectors';
import { IssueViewPlaceholder } from 'components';
import { ipcRenderer } from 'electron';

import { IssueViewContainer, IssueContainer, IssueViewTabContainer } from './styled';
import IssueViewHeader from '../IssueView/IssueViewHeader';
import IssueViewTabs from './IssueViewTabs';
import type { Id, TabLabel } from '../../types';

import IssueDetails from './IssueDetails/IssueDetails';
import IssueComments from './IssueComments/IssueComments';
import IssueWorklogs from './IssueWorklogs/IssueWorklogs';

type Props = {
  selectedIssueId: Id,
  currentTab: TabLabel,

  uploadScreenshotRequest: any,
  rejectScreenshotRequest: any,
  saveWorklogRequest: any,
  dismissIdleTimeRequest: any,
  keepIdleTimeRequest: any,
};

export type Tab = {
  label: TabLabel,
  content: Element<typeof IssueDetails | typeof IssueComments | typeof IssueWorklogs>
};

const tabs: { [TabLabel]: Tab } = {
  Details: { label: 'Details', content: <IssueDetails /> },
  Comments: { label: 'Comments', content: <IssueComments /> },
  Worklogs: { label: 'Worklogs', content: <IssueWorklogs /> },
  // { label: 'Report', content: <Statistics /> },
};

class IssueView extends Component<Props> {
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
    this.props.uploadScreenshotRequest();
  }

  rejectScreenshot = () => {
    this.props.rejectScreenshotRequest();
  }

  forceSave = () => {
    this.props.saveWorklogRequest();
  }

  dismissIdleTime = () => {
    this.props.dismissIdleTimeRequest();
  }

  keepIdleTime = () => {
    this.props.keepIdleTimeRequest();
  }

  render() {
    const { selectedIssueId, currentTab } = this.props;
    if (!selectedIssueId) {
      return <IssueViewPlaceholder />;
    }

    return (
      <IssueViewContainer column className="tracker">
        {
          /* {running &&
            <TrackingBar />
            } */
        }
        <IssueContainer>
          <IssueViewHeader />
          <IssueViewTabs tabs={tabs} />
          <IssueViewTabContainer>
            {tabs[currentTab].content}
          </IssueViewTabContainer>
        </IssueContainer>
      </IssueViewContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectedIssueId: getSelectedIssueId(state),
    currentTab: getIssueViewTab(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueView);
