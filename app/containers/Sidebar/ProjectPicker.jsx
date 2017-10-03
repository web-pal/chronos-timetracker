// @flow
import React from 'react';
import type { Node } from 'react';
import type { HOC } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { lifecycle } from 'recompose';
import Select from 'react-select';

import {
  getSelectedProjectOption,
  getSelectedSprintOption,
  getProjectsOptions,
  getProjectsFetching,
  getSprintsFetching,
  getSprintsOptions,
  getSelectedProjectType,
} from 'selectors';

import { projectsActions } from 'actions';

import type { SelectOption, SelectSprint, SelectProject } from '../../types';

function renderOption(option) {
  return option.divider
    ? <h5>{option.dividerName}</h5>
    : option.label;
}

const enhance = lifecycle({
  componentDidMount() {
    this.props.fetchProjectsRequest();
  },
});

type Props = {
  options: Array<SelectOption>,
  sprintsOptions: Array<SelectOption>,
  selectedProjectOption: SelectOption,
  selectedSprintOption: SelectOption,
  selectSprint: SelectSprint,
  selectProject: SelectProject,
  projectsFetching: boolean,
  sprintsFetching: boolean,
  projectType: string,
  disabled: boolean,
}

const ProjectPicker: HOC<*, Props> = enhance(({
  options,
  sprintsOptions,
  selectedProjectOption,
  selectedSprintOption,
  selectSprint,
  selectProject,
  projectsFetching,
  sprintsFetching,
  projectType,
  disabled,
}): Node => (
  <div
    style={{
      padding: '20px',
      borderBottom: '1px solid #e1e4e9',
    }}
  >
    <Select
      options={options}
      value={selectedProjectOption}
      placeholder="Select project"
      className="project_picker"
      onChange={(option) => {
        const type = option.meta.board ? option.meta.board.type : 'project';
        selectProject(String(option.value), type);
      }}
      isLoading={projectsFetching}
      clearable={false}
      disabled={disabled}
      optionRenderer={renderOption}
    />
    { (projectType === 'scrum') &&
      <Select
        placeholder="Select sprint"
        className="sprint_picker"
        isLoading={sprintsFetching}
        options={sprintsOptions}
        disabled={disabled}
        clearable
        value={selectedSprintOption}
        onChange={(value) => {
          selectSprint(value);
        }}
        simpleValue
      />
    }
  </div>
));

function mapStateToProps(state) {
  return {
    options: getProjectsOptions(state),
    sprintsOptions: getSprintsOptions(state),
    selectedProjectOption: getSelectedProjectOption(state),
    selectedSprintOption: getSelectedSprintOption(state),
    projectsFetching: getProjectsFetching(state),
    sprintsFetching: getSprintsFetching(state),
    projectType: getSelectedProjectType(state),
    // TODO disable if issues fetching
    disabled: false,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(projectsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPicker);
