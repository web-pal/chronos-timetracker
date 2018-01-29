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
  getRecentIssuesFetching,
  getRecentIssuesTotalCount,
  getProjectsFetching,
  getRecentItems,
  getSelectedWorklogId,
  getResourceMappedList,
} from 'selectors';

import TimestampItem from './TimestampItem';
import WorklogItem from './WorklogItem';
import NoWorklogs from './NoWorklogs';

import type {
  Id,
  IssuesMap,
  SelectIssue,
  SelectWorklog,
  SetIssueViewTab,
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
  setIssueViewTab: SetIssueViewTab,
}

const SidebarRecentItems: StatelessFunctionalComponent<Props> = ({
  recentIssues,
  selectedWorklogId,
  issuesFetching,
  projectsFetching,
  selectIssue,
  selectWorklog,
  setIssueViewTab,
}: Props): Node => (
  (issuesFetching || projectsFetching) ?
    <RecentItemsPlaceholder /> :
    <ListContainer>
      {recentIssues.length === 0 &&
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
                    selectIssue(issue, worklog);
                    selectWorklog(worklog.id);
                  }}
                  setIssueViewTab={setIssueViewTab}
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
    selectedWorklogId: getSelectedWorklogId(state),
    issuesFetching: getResourceStatus(
      state,
      'issues.requests.recentIssues.status',
      true,
    ).pending,
    projectsFetching: getProjectsFetching(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...uiActions,
    ...issuesActions,
    ...worklogsActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarRecentItems);
