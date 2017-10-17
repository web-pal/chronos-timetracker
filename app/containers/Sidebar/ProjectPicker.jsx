// @flow
import React from 'react';
import type { Node } from 'react';
import type { HOC } from 'recompose';
import { connect } from 'react-redux';
import Spinner from '@atlaskit/spinner';
import { bindActionCreators } from 'redux';
import { lifecycle } from 'recompose';
import SingleSelect, { StatelessSelect } from '@atlaskit/single-select';

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
}): Node => (
  <div
    style={{
      padding: '20px',
      borderBottom: '1px solid #e1e4e9',
    }}
  >
    {selectedProjectOption
      ? <SingleSelect
        items={options}
        hasAutocomplete
        defaultSelected={selectedProjectOption}
        placeholder="Select Project"
        onSelected={({ item }) => {
          const type = item.meta.board ? item.meta.board.type : 'project';
          selectProject(String(item.value), type);
        }}
        isLoading={projectsFetching}
        loadingMessage="Fetching Projects..."
        shouldFitContainer
        noMatchesFound="Nothing found"
      />
      : <SingleSelect
        items={options}
        hasAutocomplete
        placeholder="Select Project"
        onSelected={({ item }) => {
          const type = item.meta.board ? item.meta.board.type : 'project';
          selectProject(String(item.value), type);
        }}
        shouldFitContainer
        noMatchesFound="Nothing found"
      />
    }
    { (projectType === 'scrum') &&
      <SingleSelect
        items={sprintsOptions}
        hasAutocomplete
        selectedItem={selectedSprintOption}
        placeholder="Select sprint"
        onSelected={({ item }) => {
          selectSprint(item.value);
        }}
        isLoading={sprintsFetching}
        loadingMessage="Fetching Sprints..."
        shouldFitContainer
        noMatchesFound="Nothing found"
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
