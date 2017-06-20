import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getWorklogTypesOptions } from '../../selectors';
import * as worklogsActions from '../../actions/worklogs';
import WorklogTypePicker from '../../components/WorklogTypePicker/WorklogTypePicker';


const WorklogTypePickerWrapper = props =>
  <WorklogTypePicker {...props} />;

function mapStateToProps({ worklogs, timer }) {
  return {
    options: getWorklogTypesOptions({ worklogs }),
    uploading: worklogs.meta.worklogUploading,
    running: timer.running,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...worklogsActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WorklogTypePickerWrapper);
