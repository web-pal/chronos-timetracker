// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node, Element } from 'react';
import { connect } from 'react-redux';
import { getSelectedIssueId, getIssueViewTab, getTimerRunning } from 'selectors';
import { IssueViewPlaceholder } from 'components';

import { IssueViewContainer, IssueContainer, IssueViewTabContainer } from './styled';
import IssueViewHeader from '../IssueView/IssueViewHeader';
import IssueViewTabs from './IssueViewTabs';
import type { Id, TabLabel } from '../../types';

import IssueDetails from './IssueDetails/IssueDetails';
import IssueComments from './IssueComments/IssueComments';
import IssueWorklogs from './IssueWorklogs/IssueWorklogs';
import IssueReport from './IssueReport/IssueReport';
import TrackingBar from './TrackingBar/TrackingBar';

type Props = {
  selectedIssueId: Id | null,
  currentTab: TabLabel,
  timerRunning: boolean,
};

export type Tab = {
  label: TabLabel,
  content: Element<typeof IssueDetails | typeof IssueComments | typeof IssueWorklogs>
};

const tabs: { [TabLabel]: Tab } = {
  Details: { label: 'Details', content: <IssueDetails /> },
  Comments: { label: 'Comments', content: <IssueComments /> },
  Worklogs: { label: 'Worklogs', content: <IssueWorklogs /> },
  Report: { label: 'Report', content: <IssueReport /> },
};

const IssueView: StatelessFunctionalComponent<Props> = ({
  selectedIssueId,
  currentTab,
  timerRunning,
}: Props): Node => (selectedIssueId
  ? (
    <IssueViewContainer column className="tracker">
      {timerRunning &&
        <TrackingBar />
      }
      <IssueContainer>
        <IssueViewHeader />
        <IssueViewTabs tabs={tabs} />
        <IssueViewTabContainer>
          {tabs[currentTab].content}
        </IssueViewTabContainer>
      </IssueContainer>
    </IssueViewContainer>
  )
  : <IssueViewPlaceholder />);

function mapStateToProps(state) {
  return {
    selectedIssueId: getSelectedIssueId(state),
    currentTab: getIssueViewTab(state),
    timerRunning: getTimerRunning(state),
  };
}

export default connect(mapStateToProps, () => ({}))(IssueView);
