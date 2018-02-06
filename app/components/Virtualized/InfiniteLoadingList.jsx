// @flow
import React from 'react';
import { InfiniteLoader } from 'react-virtualized';

import AutosizableList from './AutosizableList';

type Props = {
  listProps: any,
};

const InfiniteLoadingList = (props: Props) =>
  <InfiniteLoader {...props} >
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

export default InfiniteLoadingList;
