// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';
import type {
  Connector,
} from 'react-redux';
import type {
  Id,
  Dispatch,
} from 'types';

import {
  getUiState,
  getTimerState,
  getSelectedIssue,
} from 'selectors';
import {
  IssueViewPlaceholder,
  ErrorBoundary,
} from 'components';
import {
  uiActions,
} from 'actions';

import * as S from './styled';

import IssueDetails from './IssueDetails';
import IssueComments from './IssueComments';
import IssueWorklogs from './IssueWorklogs';
import IssueReport from './IssueReport';
import TrackingBar from './TrackingBar';
import IssueViewHeader from './IssueViewHeader';
import IssueViewTabs from './IssueViewTabs';


type Props = {
  selectedIssueId: Id | null,
  trackingIssueId: Id | null,
  issueForDebug: any,
  currentTab: string,
  timerRunning: boolean,
  dispatch: Dispatch,
};

const tabs = [
  'Details',
  'Comments',
  'Worklogs',
  'Report',
];

const IssueView: StatelessFunctionalComponent<Props> = ({
  selectedIssueId,
  trackingIssueId,
  issueForDebug,
  currentTab,
  timerRunning,
  dispatch,
}: Props): Node => (selectedIssueId
  ? (
    <ErrorBoundary
      debugData={{
        selectedIssueId,
        currentTab,
        issueForDebug,
      }}
    >
      <S.IssueView column>
        {(timerRunning && trackingIssueId)
          && <TrackingBar />
        }
        <S.Issue>
          <IssueViewHeader />
          <IssueViewTabs
            onTabClick={(tab) => {
              dispatch(uiActions.setUiState({
                issueViewTab: tab,
              }));
            }}
            currentTab={currentTab}
            tabs={tabs}
          />
          <S.IssueViewTab>
            {(() => {
              switch (currentTab) {
                case 'Details':
                  return <IssueDetails />;
                case 'Comments':
                  return <IssueComments />;
                case 'Worklogs':
                  return <IssueWorklogs />;
                case 'Reports':
                  return <IssueWorklogs />;
                default:
                  return <IssueReport />;
              }
            })()}
          </S.IssueViewTab>
        </S.Issue>
      </S.IssueView>
    </ErrorBoundary>
  )
  : <IssueViewPlaceholder />);

function mapStateToProps(state) {
  return {
    selectedIssueId: getUiState('selectedIssueId')(state),
    issueForDebug: getSelectedIssue(state),
    currentTab: getUiState('issueViewTab')(state),
    trackingIssueId: getUiState('trackingIssueId')(state),
    timerRunning: getTimerState('running')(state),
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(IssueView);
