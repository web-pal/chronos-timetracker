// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';
import {
  bindActionCreators,
} from 'redux';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

import {
  SingleSelect,
} from 'components';

import {
  getSelectedProjectOption,
  getSelectedSprintOption,
  getProjectsOptions,
  getProjectsFetching,
  getSprintsFetching,
  getSprintsOptions,
  getSelectedProjectType,
} from 'selectors';

import {
  projectsActions,
} from 'actions';

import {
  ProjectPickerContainer,
} from './styled';

import type {
  SelectOption,
  SelectSprint,
  SelectProject,
} from '../../../types';


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
};

const ProjectPicker: StatelessFunctionalComponent<Props> = ({
  options,
  sprintsOptions,
  selectedProjectOption,
  selectedSprintOption,
  selectSprint,
  selectProject,
  projectsFetching,
  sprintsFetching,
  projectType,
}: Props): Node =>
  <ProjectPickerContainer>
    <SingleSelect
      items={options}
      hasAutocomplete
      selectedItem={selectedProjectOption}
      defaultSelected={selectedProjectOption || undefined}
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
  </ProjectPickerContainer>;

function mapStateToProps(state) {
  return {
    options: getProjectsOptions(state),
    sprintsOptions: getSprintsOptions(state),
    selectedProjectOption: getSelectedProjectOption(state),
    selectedSprintOption: getSelectedSprintOption(state),
    projectsFetching: getProjectsFetching(state),
    sprintsFetching: getSprintsFetching(state),
    projectType: getSelectedProjectType(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(projectsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPicker);
