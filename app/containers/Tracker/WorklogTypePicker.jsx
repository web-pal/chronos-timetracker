import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Select from 'react-select';

import { getWorklogTypesOptions } from '../../selectors';
import * as worklogsActions from '../../actions/worklogs';


const WorklogTypePicker = ({
  options,
  uploading,
  selectWorklogType,
  currentWorklogType,
}) => (
  <span>
    <Select
      options={options}
      value={currentWorklogType}
      placeholder="Select worklog type"
      onChange={(option) => {
        selectWorklogType(option ? option.value : null);
      }}
      clearable
      disabled={uploading}
    />
  </span>
);

WorklogTypePicker.propTypes = {
  options: PropTypes.array.isRequired,
  uploading: PropTypes.bool.isRequired,
  selectWorklogType: PropTypes.func.isRequired,
  currentWorklogType: PropTypes.number,
};

WorklogTypePicker.defaultProps = {
  currentWorklogType: null,
};

function mapStateToProps({ worklogs }) {
  return {
    options: getWorklogTypesOptions({ worklogs }),
    currentWorklogType: worklogs.meta.currentWorklogType,
    uploading: worklogs.meta.worklogUploading,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...worklogsActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WorklogTypePicker);
