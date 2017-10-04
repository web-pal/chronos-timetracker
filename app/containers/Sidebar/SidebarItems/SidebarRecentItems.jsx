// @flow
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { StatelessFunctionalComponent, Node } from 'react';
import moment from 'moment';
import { Flex } from 'components';
import { issuesActions } from 'actions';
import {
  getRecentIssues,
  getIssuesFetching,
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
  selectIssue: SelectIssue,
}

const SidebarRecentItems: StatelessFunctionalComponent<Props> = ({
  items,
  fetching,
  selectIssue,
}: Props): Node =>
  <div className="RecentItems">
    {items.map(item => item.worklog &&
      <Flex key={item.day} column className="RecentItems__block">
        <TimestampItem
          date={item.day}
          worklogs={item.worklog.worklogs}
        />
        <Flex column className="RecentItems__list">
          {item.worklog.worklogs.map(worklog => worklog.issue &&
            <SidebarItem
              key={worklog.id}
              issue={worklog.issue}
              active={false}
              selectIssue={selectIssue}
            />,
          )}
        </Flex>
      </Flex>,
    )}
    {items.length === 0 && !fetching &&
      <Flex column centered className="RecentEmptyItem">
        Nothing has been tracked recently
      </Flex>
    }
  </div>;

function mapStateToProps(state) {
  return {
    items: getRecentIssues(state),
    fetching: getIssuesFetching(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(issuesActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarRecentItems);
