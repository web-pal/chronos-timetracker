// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  getAllIssues,
  getIssuesFetching,
  getIssuesTotalCount,
  getSelectedIssueId,
  getTrackingIssueId,
} from 'selectors';
import { InfiniteLoadingList, IssuePlaceholder } from 'components';
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
  totalCount: number,
  selectedIssueId: Id | null,
  trackingIssueId: Id | null,
  fetchIssuesRequest: FetchIssuesRequest,
  selectIssue: SelectIssue,
};

const SidebarAllItems: StatelessFunctionalComponent<Props> = ({
  items,
  fetching,
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
      console.log(data);
      const promise = new Promise((resolve) => {
        fetchIssuesRequest(data);
        resolve();
      });
      return promise;
    }}
    rowCount={totalCount}
    listProps={{
      autoSized: true,
      // scrollToIndex: selectedIssueIndex,
      scrollToAlignment: 'center',
      rowCount: fetching && totalCount === 0 ? 10 : totalCount - 1,
      rowHeight: 101,
      // eslint-disable-next-line react/prop-types
      rowRenderer: ({ index, key, style }) => {
        const item: ?Issue = items[index];

        return <div style={style} key={key}>
          {item
            ? <SidebarItem
              issue={item}
              active={selectedIssueId === item.id}
              tracking={trackingIssueId === item.id}
              selectIssue={selectIssue}
            />
            : <IssuePlaceholder />
          }
        </div>;
      },
    }}
  />;

function mapStateToProps(state) {
  return {
    items: getAllIssues(state),
    fetching: getIssuesFetching(state),
    totalCount: getIssuesTotalCount(state),
    selectedIssueId: getSelectedIssueId(state),
    trackingIssueId: getTrackingIssueId(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(issuesActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarAllItems);
