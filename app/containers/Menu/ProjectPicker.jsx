import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { lifecycle } from 'recompose';
import Select from 'react-select';

import {
  getSelectedProjectOption,
  getProjectsOptions,
  getScrumBoardsOptions,
  getKanbanBoardsOptions,
  getSprints,
  getSelectedSprintOption,
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
  sprintsFetching,
  projectType,
  sprints,
  selectSprint,
  selectedSprint,
}) => (
  <span style={{ padding: '0 20px 20px 20px', borderBottom: '1px solid #e1e4e9' }}>
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
    { (projectType === 'scrum') &&
      <Select
        placeholder="Select sprint"
        className="siprint_picker"
        isLoading={sprintsFetching}
        options={sprints}
        disabled={disabled}
        clearable
        value={selectedSprint}
        onChange={(option) => {
          selectSprint(option && option.value);
          clearWorklogs();
          clearIssues();
          fetchRecentIssues();
          fetchIssues();
          fetchIssuesAllTypes();
          fetchIssuesAllStatuses();
        }}
      />
    }
  </span>
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
  sprintsFetching: PropTypes.bool.isRequired,
  projectType: PropTypes.string.isRequired,
  sprints: PropTypes.array.isRequired,
  selectedSprint: PropTypes.object,
};

function mapStateToProps({ projects, issues }) {
  const options = [
    ...getProjectsOptions({ projects }),
    ...getScrumBoardsOptions({ projects }),
    ...getKanbanBoardsOptions({ projects }),
  ];
  const selectedProject = getSelectedProjectOption({ projects });
  const selectedSprint = getSelectedSprintOption({ projects });
  const sprints = getSprints({ projects });
  return {
    options,
    projectsFetching: projects.meta.get('fetching'),
    selectedProject,
    sprints,
    selectedSprint,
    disabled: issues.meta.fetching || issues.meta.searchFetching || issues.meta.recentFetching,
    sprintsFetching: projects.meta.get('sprintsFetching'),
    projectType: projects.meta.get('selectedProjectType'),
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
