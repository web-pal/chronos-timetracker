import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import InfiniteLoadingList from '../../Virtualized/InfiniteLoadingList';
import SidebarItemWrapper from '../../../containers/ComponentsWrappers/SidebarItemWrapper';
import IssuePlaceholder from '../../../components/Sidebar/Issue/Placeholder';

const SidebarAllItems = ({
  totalCount, allItems, fetchIssues, selectedIssueIndex, fetching,
}) =>
  <InfiniteLoadingList
    isRowLoaded={({ index }) => !!allItems.get(index)}
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
        const item = allItems.get(index);

        return item.name;
      },
    }}
  />;

SidebarAllItems.propTypes = {
  totalCount: PropTypes.number.isRequired,
  allItems: ImmutablePropTypes.list.isRequired,
  fetchIssues: PropTypes.func.isRequired,
  selectedIssueIndex: PropTypes.number,
  fetching: PropTypes.bool.isRequired,
};

SidebarAllItems.defaultProps = {
  selectedIssueIndex: 0,
};

export default SidebarAllItems;
