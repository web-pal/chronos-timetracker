import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getSelectedProjectOption, getProjectsOptions } from '../selectors/';

import * as projectsActions from '../actions/projects';

import Dropdown from '../components/Dropdown/Dropdown';

const ProjectPickerWrapper = ({
  options,
  selectProject,
  selectedProject,
  projectsFetching,
}) =>
  <Dropdown
    options={options}
    onChange={selectProject}
    placeholder="Select project"
    value={selectedProject}
    fetching={projectsFetching}
    className="ProjectPicker"
  />;

ProjectPickerWrapper.propTypes = {
  options: PropTypes.array.isRequired,
  projectsFetching: PropTypes.bool.isRequired,
  selectedProject: PropTypes.object.isRequired,
  selectProject: PropTypes.func.isRequired,
};

function mapStateToProps({ projects }) {
  const options = getProjectsOptions({ projects });
  const selectedProject = getSelectedProjectOption({ projects });
  return {
    options,
    projectsFetching: projects.meta.get('fetching'),
    selectedProject,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...projectsActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPickerWrapper);
