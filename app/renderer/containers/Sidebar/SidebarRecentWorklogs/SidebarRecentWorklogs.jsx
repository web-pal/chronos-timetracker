// @flow
import React from 'react';
import moment from 'moment';
import {
  connect,
} from 'react-redux';
import {
  compose,
  lifecycle,
} from 'recompose';
import {
  getStatus as getResourceStatus,
} from 'redux-resource';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';
import type {
  Id,
  Dispatch,
} from 'types';

import {
  Flex,
  RecentItemsPlaceholder,
} from 'components';
import {
  uiActions,
  issuesActions,
} from 'actions';
import {
  getRecentIssues,
  getUiState,
} from 'selectors';

import TimestampItem from './TimestampItem';
import WorklogItem from './WorklogItem';
import NoWorklogs from './NoWorklogs';


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
  currentIssueViewTab: string,
  issuesFetching: boolean,
  projectsFetching: boolean,
  dispatch: Dispatch,
}

const SidebarRecentItems: StatelessFunctionalComponent<Props> = ({
  recentIssues,
  selectedWorklogId,
  currentIssueViewTab,
  issuesFetching,
  projectsFetching,
  dispatch,
}: Props): Node => (
  (
    issuesFetching
    || projectsFetching
  ) ? (
    <RecentItemsPlaceholder />
    ) : (
      <ListContainer>
        {
          Object.keys(recentIssues).length === 0 && (
            <NoWorklogs />
          )
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
                {worklogs.map(worklog => (
                  <WorklogItem
                    key={`${day}_${worklog.id}`}
                    issue={worklog.issue}
                    active={selectedWorklogId === worklog.id}
                    showShowButton={currentIssueViewTab !== 'Worklogs'}
                    selectIssue={(issueId) => {
                      dispatch(uiActions.setUiState({
                        selectedIssueId: issueId,
                        selectedWorklogId: worklog.id,
                      }));
                      dispatch(uiActions.issueWorklogsScrollToIndexRequest(
                        worklog.id,
                        issueId,
                      ));
                    }}
                    onClickShow={
                      (issueId) => {
                        dispatch(uiActions.setUiState({
                          issueViewTab: 'Worklogs',
                        }));
                        dispatch(uiActions.issueWorklogsScrollToIndexRequest(
                          worklog.id,
                          issueId,
                        ));
                      }
                    }
                    worklog={worklog}
                  />
                ))}
              </Flex>
            </ItemContainer>
          );
        })}
      </ListContainer>
    )
);

function mapStateToProps(state) {
  return {
    recentIssues: getRecentIssues(state),
    sidebarType: getUiState('sidebarType')(state),
    selectedWorklogId: getUiState('selectedWorklogId')(state),
    issuesFetched: !getResourceStatus(
      state,
      'issues.requests.recentIssues.status',
    ).idle,
    issuesFetching: getResourceStatus(
      state,
      'issues.requests.recentIssues.status',
    ).pending,
    projectsFetching: getResourceStatus(
      state,
      'projects.requests.allProjects.status',
    ).pending,
    currentIssueViewTab: getUiState('issueViewTab')(state),
  };
}

export default compose(
  connect(
    mapStateToProps,
    dispatch => ({ dispatch }),
  ),
  lifecycle({
    componentDidUpdate() {
      if (
        this.props.sidebarType === 'recent'
        && !this.props.issuesFetched
        && !this.props.issuesFetching
      ) {
        this.props.dispatch(issuesActions.fetchRecentIssuesRequest());
      }
    },
  }),
)(SidebarRecentItems);
