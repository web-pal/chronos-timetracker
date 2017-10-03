// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllIssues } from 'selectors';

type Props = {
  fetching: boolean,
};

const SidebarAllItems: StatelessFunctionalComponent<Props> = ({
  fetching,
  items,
}: Props): Node =>
  <InfiniteLoadingList
    isRowLoaded={({ index }) => !!items.get(index)}
    minimumBatchSize={50}
    threshold={20}
    loadMoreRows={(data) => {
      const promise = new Promise((resolve) => {
        fetchIssues(data, resolve);
      });
      return promise;
    }}
    rowCount={totalCount}
    listProps={{
      autoSized: true,
      scrollToIndex: selectedIssueIndex,
      scrollToAlignment: 'center',
      rowCount: fetching ? 10 : totalCount,
      rowHeight: 101,
      // eslint-disable-next-line react/prop-types
      rowRenderer: ({ index, key, style }) => {
        const item = items[index];

        return item.name;
      },
    }}
  />;

function mapStateToProps(state) {
  return {
    items: getAllIssues(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarAllItems);
