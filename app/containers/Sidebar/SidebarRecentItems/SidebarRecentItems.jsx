import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { StatelessFunctionalComponent, Node } from 'react';
import { Flex, RecentItemsPlaceholder } from 'components';
import { issuesActions, worklogsActions } from 'actions';
import {
  getRecentIssuesFetching,
  getSidebarType,
  getRecentItems,
  getSelectedWorklogId,
} from 'selectors';

import TimestampItem from './SidebarTimestampItem';
import WorklogItem from './WorklogItem/WorklogItem';

import type { IssuesMap, SelectIssue, SelectWorklog, Id } from '../../../types';

import {
  RecentItemsContainer,
  RecentItemsBlock,
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
  items: IssuesMap,
  selectedWorklogId: Id | null,
  fetching: boolean,
  sidebarType: string,
  selectIssue: SelectIssue,
  selectWorklog: SelectWorklog,
}

const daySorter = (a, b) => {
  if (moment(a).isAfter(moment(b))) return -1;
  if (moment(a).isBefore(moment(b))) return 1;
  return 0;
};

const worklogSorter = (a, b) => {
  if (moment(a.created).isAfter(moment(b.created))) return -1;
  if (moment(a.created).isBefore(moment(b.created))) return 1;
  return 0;
};

const SidebarRecentItems: StatelessFunctionalComponent<Props> = ({
  items,
  selectedWorklogId,
  fetching,
  sidebarType,
  selectIssue,
  selectWorklog,
}: Props): Node => (fetching ?
  <RecentItemsPlaceholder /> :
  <RecentItemsContainer style={{ display: sidebarType === 'recent' ? 'block' : 'none' }}>
    {Object.keys(items).sort(daySorter).map((key) => {
      const item = items[key].sort(worklogSorter);

      return (
        <RecentItemsBlock key={key}>
          <TimestampItem
            date={moment(key)}
            worklogs={item}
          />
          <Flex column>
            {item.map((worklog, i) =>
              <WorklogItem
                key={`${key}_${worklog.id}`}
                issue={worklog.issue}
                active={selectedWorklogId === worklog.id}
                selectIssue={(issue) => {
                  selectIssue(issue, worklog);
                  selectWorklog(worklog.id);
                }}
                worklog={worklog}
              />)}
          </Flex>
        </RecentItemsBlock>
      );
    })}
  </RecentItemsContainer>);

function mapStateToProps(state) {
  return {
    items: getRecentItems(state),
    selectedWorklogId: getSelectedWorklogId(state),
    fetching: getRecentIssuesFetching(state),
    sidebarType: getSidebarType(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...issuesActions, ...worklogsActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarRecentItems);
