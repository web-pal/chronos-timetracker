// @flow
import React from 'react';
import { AutoSizer, List } from 'react-virtualized';

type Props = {
  listProps: any,
  autoSized?: boolean,
};

const AutosizableList = (props: Props) =>
  <AutoSizer
    {...props}
  >
    {({ height, width }) => (
      <List
        {...props.listProps}
        width={props.autoSized ? width : props.listProps.width}
        height={props.autoSized ? height : props.listProps.height}
      />
    )}
  </AutoSizer>;

AutosizableList.defaultProps = {
  autoSized: false,
};

export default AutosizableList;
