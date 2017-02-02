import React, { PropTypes } from 'react';
import { InfiniteLoader } from 'react-virtualized';

import AutosizableList from './AutosizableList';

const InfiniteLoadingList = (props) =>
  <InfiniteLoader {...props}>
    {({ onRowsRendered, registerChild }) => (
      <AutosizableList
        autoSized={props.listProps.autoSized}
        listProps={{
          ...props.listProps,
          onRowsRendered,
          registerChild,
        }}
      />
    )}
  </InfiniteLoader>;

InfiniteLoadingList.propTypes = {
  listProps: PropTypes.object.isRequired,
};

export default InfiniteLoadingList;
