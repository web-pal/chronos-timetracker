import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import InfiniteLoadingList from '../../Virtualized/InfiniteLoadingList';
import SidebarItem from '../../../containers/ComponentsWrappers/SidebarItemWrapper';

const SidebarAllItems = ({
  totalCount, allItems, fetchIssues, selectedIssueIndex,
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
      rowCount: totalCount,
      rowHeight: 101,
      // eslint-disable-next-line react/prop-types
      rowRenderer: ({ index, key, style, ...kek }) => {
        // TODO implement placeholders
        const item = allItems.get(index);

        return (
          <SidebarItem
            key={key}
            issue={item || new Immutable.Map()}
            style={style}
            itemType="All"
          />
        );
      },
    }}
  />;

SidebarAllItems.propTypes = {
  totalCount: PropTypes.number.isRequired,
  allItems: ImmutablePropTypes.list.isRequired,
  fetchIssues: PropTypes.func.isRequired,
  selectedIssueIndex: PropTypes.number,
};

SidebarAllItems.defaultProps = {
  selectedIssueIndex: 0,
};

export default SidebarAllItems;
