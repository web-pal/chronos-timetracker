// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';
import {
  bindActionCreators,
} from 'redux';

import type {
  StatelessFunctionalComponent,
  Node,
  Element,
} from 'react';

import {
  getUiState,
  getTimerRunning,
} from 'selectors';
import {
  IssueViewPlaceholder,
} from 'components';
import {
  uiActions,
} from 'actions';

import {
  IssueViewContainer,
  IssueContainer,
  IssueViewTabContainer,
} from './styled';

import type {
  Id,
  TabLabel,
} from '../../types';

import IssueDetails from './IssueDetails';
import IssueComments from './IssueComments';
import IssueWorklogs from './IssueWorklogs';
import IssueReport from './IssueReport';
import TrackingBar from './TrackingBar';
import IssueViewHeader from '../IssueView/IssueViewHeader';
import IssueViewTabs from './IssueViewTabs';

type Props = {
  selectedIssueId: Id | null,
  currentTab: TabLabel,
  timerRunning: boolean,
};

export type Tab = {
  label: TabLabel,
  content: Element<typeof IssueDetails | typeof IssueComments | typeof IssueWorklogs>
};

const tabs = [
  'Details',
  'Comments',
  'Worklogs',
  'Report',
];

const IssueView: StatelessFunctionalComponent<Props> = ({
  selectedIssueId,
  currentTab,
  timerRunning,
  setUiState,
}: Props): Node => (selectedIssueId
  ? (
    <IssueViewContainer column>
      {timerRunning &&
        <TrackingBar />
      }
      <IssueContainer>
        <IssueViewHeader />
        <IssueViewTabs
          currentTab={currentTab}
          setUiState={setUiState}
          tabs={tabs}
        />
        <IssueViewTabContainer>
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
        </IssueViewTabContainer>
      </IssueContainer>
    </IssueViewContainer>
  )
  : <IssueViewPlaceholder />);

function mapStateToProps(state) {
  return {
    selectedIssueId: getUiState('selectedIssueId')(state),
    currentTab: getUiState('issueViewTab')(state),
    timerRunning: getTimerRunning(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...uiActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueView);
