import React, { PropTypes } from 'react';
import Select from 'react-select';


const WorklogTypePicker = ({
  options,
  uploading,
  running,
  selectWorklogType,
  updateWorklogType,
  currentWorklogType,
  currentWorklogId,
  disabled,
  showText,
}) => (
  <div className="worklog-type-picker">
    {showText ?
      <span>
        {currentWorklogType ? options.find(o => o.value === currentWorklogType).label : '---'}
      </span> :
      <Select
        options={options}
        value={currentWorklogType}
        placeholder="Select worklog type"
        onChange={(option) => {
          const value = option ? option.value : null;
          if (running) {
            selectWorklogType(value);
          } else {
            updateWorklogType(value, currentWorklogId);
          }
        }}
        clearable
        disabled={uploading || disabled}
      />
    }
  </div>
);

WorklogTypePicker.propTypes = {
  options: PropTypes.array.isRequired,
  uploading: PropTypes.bool.isRequired,
  running: PropTypes.bool.isRequired,
  selectWorklogType: PropTypes.func.isRequired,
  updateWorklogType: PropTypes.func.isRequired,
  currentWorklogType: PropTypes.number,
  currentWorklogId: PropTypes.string,
  disabled: PropTypes.bool,
  showText: PropTypes.bool,
};

WorklogTypePicker.defaultProps = {
  currentWorklogType: null,
  currentWorklogId: null,
  disabled: false,
  showText: false,
};

export default WorklogTypePicker;
