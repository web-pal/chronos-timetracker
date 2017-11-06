import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { StatelessFunctionalComponent, Node } from 'react';
import { Flex, RecentItemsPlaceholder } from 'components';
import { issuesActions } from 'actions';
import {
  getRecentIssuesFetching,
  getSidebarType,
  getRecentItems,
} from 'selectors';

import TimestampItem from './SidebarTimestampItem';
import SidebarItem from './SidebarItem';

import type { IssuesMap, SelectIssue } from '../../../types';

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
  fetching: boolean,
  sidebarType: string,
  selectIssue: SelectIssue,
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
  fetching,
  sidebarType,
  selectIssue,
}: Props): Node => (fetching ?
  <RecentItemsPlaceholder /> :
  <div className="RecentItems" style={{ display: sidebarType === 'recent' ? 'block' : 'none' }}>
    {Object.keys(items).sort(daySorter).map((key) => {
      const item = items[key].sort(worklogSorter);

      return (
        <Flex key={key} column className="RecentItems__block">
          <TimestampItem
            date={moment(key)}
            worklogs={item}
          />
          <Flex column className="RecentItems__list">
            {item.map((worklog, i) =>
              <SidebarItem
                key={`${key}_${worklog.id}_${i}`}
                issue={worklog.issue}
                active={false}
                selectIssue={(issue) => selectIssue(issue, worklog)}
                worklog={worklog}
              />,
            )}
          </Flex>
        </Flex>
      );
    })}
  </div>);

function mapStateToProps(state) {
  return {
    items: getRecentItems(state),
    fetching: getRecentIssuesFetching(state),
    sidebarType: getSidebarType(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(issuesActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarRecentItems);
