import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { lifecycle } from 'recompose';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import {
  getSelectedProjectOption,
  getProjectsOptions,
  getBoardsOptions,
} from '../../selectors';

import * as projectsActions from '../../actions/projects';
import * as issuesActions from '../../actions/issues';
import * as worklogsActions from '../../actions/worklogs';

function renderOpions(option) {
  return option.divider
    ? (
      <h5>
        {option.dividerName}
      </h5>
    )
    : option.label;
}

const enhance = lifecycle({
  componentDidMount() {
    this.props.fetchProjects(true);
  },
});

const ProjectPicker = enhance(({
  options,
  selectProject,
  clearWorklogs,
  clearIssues,
  fetchIssues,
  fetchIssuesAllTypes,
  fetchIssuesAllStatuses,
  fetchRecentIssues,
  selectedProject,
  projectsFetching,
  disabled,
}) => (
  <Select
    options={options}
    value={selectedProject}
    placeholder="Select project"
    className="ProjectPicker"
    onChange={(option) => {
      selectProject(option.value, option.type);
      clearWorklogs();
      clearIssues();
      fetchRecentIssues();
      fetchIssues();
      fetchIssuesAllTypes();
      fetchIssuesAllStatuses();
    }}
    isLoading={projectsFetching}
    clearable={false}
    disabled={disabled}
    optionRenderer={renderOpions}
  />
));

ProjectPicker.propTypes = {
  options: PropTypes.array.isRequired,
  projectsFetching: PropTypes.bool.isRequired,
  selectedProject: PropTypes.object,
  selectProject: PropTypes.func.isRequired,
  fetchIssues: PropTypes.func.isRequired,
  fetchRecentIssues: PropTypes.func.isRequired,
  clearWorklogs: PropTypes.func.isRequired,
  clearIssues: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

function mapStateToProps({ projects, issues }) {
  const options = [
    ...getProjectsOptions({ projects }),
    ...getBoardsOptions({ projects }),
  ];
  const selectedProject = getSelectedProjectOption({ projects });
  return {
    options,
    projectsFetching: projects.meta.get('fetching'),
    selectedProject,
    disabled: issues.meta.fetching || issues.meta.searchFetching || issues.meta.recentFetching,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...projectsActions,
    ...issuesActions,
    ...worklogsActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPicker);
