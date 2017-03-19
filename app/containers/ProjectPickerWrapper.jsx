import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { lifecycle } from 'recompose';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import { getSelectedProjectOption, getProjectsOptions } from '../selectors/';

import * as projectsActions from '../actions/projects';

const enhance = lifecycle({
  componentDidMount() {
    this.props.fetchProjects(true);
  },
});

const ProjectPickerWrapper = enhance(({
  options,
  selectProject,
  selectedProject,
  projectsFetching,
}) => (
  <Select
    options={options}
    value={selectedProject}
    placeholder="Select project"
    className="ProjectPicker"
    onChange={option => selectProject(option.value)}
    isLoading={projectsFetching}
    clearable={false}
  />
));

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
  return bindActionCreators(projectsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPickerWrapper);
