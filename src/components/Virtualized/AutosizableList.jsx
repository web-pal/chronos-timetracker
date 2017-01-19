import React, { PropTypes } from 'react';
import { AutoSizer, List } from 'react-virtualized';

const AutosizableList = (props) =>
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

AutosizableList.propTypes = {
  listProps: PropTypes.object.isRequired,
  autoSized: PropTypes.bool,
};

export default AutosizableList;
