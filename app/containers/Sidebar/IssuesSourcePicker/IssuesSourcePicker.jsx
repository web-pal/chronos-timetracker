// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';
import {
  bindActionCreators,
} from 'redux';
import {
  getStatus as getResourceStatus,
} from 'redux-resource';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

import {
  SingleSelect,
} from 'components';

import {
  getIssuesSourceOptions,
  getSelectedSprintOption,
  getSprintsOptions,
  getIssuesSourceSelectedOption,
  getUiState,
} from 'selectors';

import {
  projectsActions,
  issuesActions,
  sprintsActions,
  uiActions,
} from 'actions';

import {
  IssuesSourceContainer,
} from './styled';

import type {
  SelectOption,
  SelectSprint,
} from '../../../types';


type Props = {
  options: Array<SelectOption>,
  sprintsOptions: Array<SelectOption>,
  selectedOption: SelectOption,
  selectedSprintOption: SelectOption,
  projectsFetching: boolean,
  sprintsFetching: boolean,
  selectedSourceType: string,
};

const IssuesSourcePicker: StatelessFunctionalComponent<Props> = ({
  options,
  selectedOption,
  sprintsOptions,
  selectedSprintOption,
  projectsFetching,
  sprintsFetching,
  selectedSourceType,
  setUiState,
  refetchIssuesRequest,
  fetchSprintsRequest,
}: Props): Node =>
  <IssuesSourceContainer>
    <SingleSelect
      items={options}
      hasAutocomplete
      selectedItem={selectedOption}
      defaultSelected={selectedOption || undefined}
      placeholder="Select project or board"
      onSelected={({ item }) => {
        const type = item.meta.board ? item.meta.board.type : 'project';
        setUiState('issuesSprintId', null);
        setUiState('issuesSourceId', item.value);
        setUiState('issuesSourceType', type);
        if (type === 'scrum') {
          fetchSprintsRequest();
        } else if (item.value) {
          setUiState('filterStatusesIsFetched', false);
          refetchIssuesRequest();
        }
      }}
      isLoading={projectsFetching}
      loadingMessage="Fetching projects..."
      shouldFitContainer
      noMatchesFound="Nothing found"
    />
    { (selectedSourceType === 'scrum') &&
      <SingleSelect
        items={sprintsOptions}
        hasAutocomplete
        selectedItem={selectedSprintOption}
        defaultSelected={selectedSprintOption || undefined}
        placeholder="Select sprint"
        onSelected={({ item }) => {
          setUiState('issuesSprintId', item.value);
          refetchIssuesRequest();
        }}
        isLoading={sprintsFetching}
        loadingMessage="Fetching sprints..."
        shouldFitContainer
        noMatchesFound="Nothing found"
      />
    }
  </IssuesSourceContainer>;

function mapStateToProps(state) {
  return {
    options: getIssuesSourceOptions(state),
    selectedOption: getIssuesSourceSelectedOption(state),
    selectedSourceType: getUiState('issuesSourceType')(state),

    sprintsOptions: getSprintsOptions(state),
    selectedSprintOption: getSelectedSprintOption(state),
    projectsFetching: getResourceStatus(
      state,
      'projects.requests.allProjects.status',
      true,
    ).pending,
    sprintsFetching: getResourceStatus(
      state,
      'sprints.requests.allSprints.status',
      true,
    ).pending,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...projectsActions,
    ...uiActions,
    ...issuesActions,
    ...sprintsActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IssuesSourcePicker);
