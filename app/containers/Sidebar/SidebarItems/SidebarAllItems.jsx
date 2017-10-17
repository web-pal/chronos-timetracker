// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  getSidebarIssues,
  getIssuesFetching,
  getIssuesSearching,
  getIssuesTotalCount,
  getSelectedIssueId,
  getTrackingIssueId,
} from 'selectors';
import { InfiniteLoadingList, IssueItemPlaceholder } from 'components';
import { issuesActions } from 'actions';

import SidebarItem from './SidebarItem';
import type {
  IssuesMap,
  FetchIssuesRequest,
  SelectIssue,
  Issue,
  Id,
} from '../../../types';

type Props = {
  items: IssuesMap,
  fetching: boolean,
  searching: boolean,
  totalCount: number,
  selectedIssueId: Id | null,
  trackingIssueId: Id | null,
  fetchIssuesRequest: FetchIssuesRequest,
  selectIssue: SelectIssue,
};

const SidebarAllItems: StatelessFunctionalComponent<Props> = ({
  items,
  fetching,
  searching,
  totalCount,
  selectedIssueId,
  trackingIssueId,
  fetchIssuesRequest,
  selectIssue,
}: Props): Node =>
  <InfiniteLoadingList
    isRowLoaded={({ index }) => !!items[index]}
    minimumBatchSize={50}
    threshold={20}
    loadMoreRows={(data) => {
      const promise = new Promise((resolve) => {
        fetchIssuesRequest({ ...data, search: false });
        resolve();
      });
      return promise;
    }}
    rowCount={totalCount}
    listProps={{
      autoSized: true,
      // scrollToIndex: selectedIssueIndex,
      scrollToAlignment: 'center',
      rowCount: (totalCount === 0 && fetching) ? 10 :
        totalCount === 0 ? totalCount : totalCount - 1, // TODO: fix this shit
      rowHeight: 101,
      // eslint-disable-next-line react/prop-types
      rowRenderer: ({ index, key, style }) => {
        const item: ?Issue = items[index];
        if (searching && fetching) {
          return <IssueItemPlaceholder />;
        }

        return <div style={style} key={key}>
          {item
            ? <SidebarItem
              issue={item}
              active={selectedIssueId === item.id}
              tracking={trackingIssueId === item.id}
              selectIssue={selectIssue}
            />
            : <IssueItemPlaceholder />
          }
        </div>;
      },
    }}
  />;

function mapStateToProps(state) {
  return {
    items: getSidebarIssues(state),
    fetching: getIssuesFetching(state),
    searching: getIssuesSearching(state),
    totalCount: getIssuesTotalCount(state),
    selectedIssueId: getSelectedIssueId(state),
    trackingIssueId: getTrackingIssueId(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(issuesActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarAllItems);
