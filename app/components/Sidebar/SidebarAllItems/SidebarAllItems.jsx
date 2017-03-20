import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import InfiniteLoadingList from '../../Virtualized/InfiniteLoadingList';
import SidebarItem from './SidebarItem';

const SidebarAllItems = ({
  totalCount, items, fetchIssues, selectIssue,
}) =>
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
      rowCount: totalCount,
      rowHeight: 40,
      // eslint-disable-next-line react/prop-types
      rowRenderer: ({ index, key, style }) => {
        const item = items.get(index);
        return (
          <SidebarItem
            key={key}
            item={item || new Immutable.Map()}
            style={style}
            onClick={selectIssue}
          />
        );
      },
    }}
  />;

SidebarAllItems.propTypes = {
  totalCount: PropTypes.number.isRequired,
  items: ImmutablePropTypes.list.isRequired,
  fetchIssues: PropTypes.func.isRequired,
  selectIssue: PropTypes.func.isRequired,
};

export default SidebarAllItems;
