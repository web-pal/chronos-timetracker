import React from 'react';
import moment from 'moment';
import {
  connect,
} from 'react-redux';
import {
  bindActionCreators,
} from 'redux';
import {
  getStatus as getResourceStatus,
} from 'redux-resource';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

import {
  Flex,
  RecentItemsPlaceholder,
} from 'components';
import {
  uiActions,
  issuesActions,
  worklogsActions,
} from 'actions';
import {
  getRecentIssues,
  getUiState,
} from 'selectors';

import TimestampItem from './TimestampItem';
import WorklogItem from './WorklogItem';
import NoWorklogs from './NoWorklogs';

import type {
  Id,
  SelectIssue,
  SelectWorklog,
} from '../../../types';

import {
  ListContainer,
  ItemContainer,
} from './styled';

moment.locale('en', {
  calendar: {
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    lastWeek: 'L',
    sameElse: 'L',
  },
});


type Props = {
  recentIssues: any,
  selectedWorklogId: Id | null,
  issuesFetching: boolean,
  projectsFetching: boolean,
  selectIssue: SelectIssue,
  selectWorklog: SelectWorklog,
}

const SidebarRecentItems: StatelessFunctionalComponent<Props> = ({
  recentIssues,
  selectedWorklogId,
  issuesFetching,
  projectsFetching,
  dispatch,
}: Props): Node => (
  (issuesFetching || projectsFetching) ?
    <RecentItemsPlaceholder /> :
    <ListContainer>
      {Object.keys(recentIssues).length === 0 &&
        <NoWorklogs />
      }
      {Object.keys(recentIssues).map((day) => {
        const worklogs = recentIssues[day];
        return (
          <ItemContainer key={day}>
            <TimestampItem
              date={moment(day)}
              worklogs={worklogs}
            />
            <Flex column>
              {worklogs.map(worklog =>
                <WorklogItem
                  key={`${day}_${worklog.id}`}
                  issue={worklog.issue}
                  active={selectedWorklogId === worklog.id}
                  selectIssue={(issue) => {
                    dispatch(uiActions.setUiState('selectedIssueId', issue.id));
                    dispatch(uiActions.setUiState('selectedWorklogId', worklog.id));
                  }}
                  onClickShow={
                    (issue) => {
                      dispatch(uiActions.setUiState(
                        'issueViewTab',
                        'Worklogs',
                      ));
                      dispatch(uiActions.issueWorklogsScrollToIndexRequest(
                        worklog.id,
                        issue.id,
                      ));
                    }
                  }
                  worklog={worklog}
                />)}
            </Flex>
          </ItemContainer>
        );
      })}
    </ListContainer>
);

function mapStateToProps(state) {
  return {
    recentIssues: getRecentIssues(state),
    selectedWorklogId: getUiState('selectedWorklogId')(state),
    issuesFetching: getResourceStatus(
      state,
      'issues.requests.recentIssues.status',
      true,
    ).pending,
    projectsFetching: getResourceStatus(
      state,
      'projects.requests.allProjects.status',
      true,
    ).pending,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...uiActions,
    ...issuesActions,
    ...worklogsActions,
    dispatch,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarRecentItems);
