// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';
import {
  getStatus as getResourceStatus,
} from 'redux-resource';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';
import type {
  Connector,
} from 'react-redux';
import type {
  Dispatch,
  SelectedOption,
} from 'types';

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
  issuesActions,
  sprintsActions,
  resourcesActions,
  uiActions,
} from 'actions';

import JQLFilter from './JQLFilter';

import { IssuesSourceContainer } from './styled';

type Props = {
  options: Array<any>,
  sprintsOptions: Array<any>,
  selectedOption: SelectedOption,
  selectedSprintOption: any,
  projectsFetching: boolean,
  sprintsFetching: boolean,
  selectedSourceType: string,
  dispatch: Dispatch,
};

const IssuesSourcePicker: StatelessFunctionalComponent<Props> = ({
  options,
  sprintsOptions,
  selectedOption,
  selectedSprintOption,
  projectsFetching,
  sprintsFetching,
  selectedSourceType,
  dispatch,
}: Props): Node =>
  <IssuesSourceContainer>
    <SingleSelect
      items={options}
      hasAutocomplete
      selectedItem={selectedOption}
      defaultSelected={selectedOption || undefined}
      placeholder="Select project or board"
      onSelected={({ item }) => {
        let type = '';
        if (item.meta.board) type = item.meta.board.type;
        if (item.meta.project) type = 'project';
        if (item.meta.filter) type = 'filter';
        dispatch(uiActions.setUiState('issuesSprintId', null));
        dispatch(uiActions.setUiState('issuesSourceId', item.value));
        dispatch(uiActions.setUiState('issuesSourceType', type));
        dispatch(uiActions.setIssuesFilters('assignee', []));
        dispatch(uiActions.setIssuesFilters('status', []));
        dispatch(uiActions.setIssuesFilters('type', []));
        if (type === 'scrum') {
          dispatch(resourcesActions.clearResourceList({
            resourceType: 'issues',
            list: 'recentIssues',
          }));
          dispatch(sprintsActions.fetchSprintsRequest());
        } else if (item.value) {
          dispatch(uiActions.setUiState('filterStatusesIsFetched', false));
          dispatch(resourcesActions.clearResourceList({
            resourceType: 'issues',
            list: 'recentIssues',
          }));
          dispatch(issuesActions.refetchIssuesRequest());
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
          dispatch(uiActions.setUiState('issuesSprintId', item.value));
          dispatch(issuesActions.refetchIssuesRequest());
        }}
        isLoading={sprintsFetching}
        loadingMessage="Fetching sprints..."
        shouldFitContainer
        noMatchesFound="Nothing found"
      />
    }
    {selectedSourceType === 'filter' && <JQLFilter selectedFilter={selectedOption} />}
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

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(IssuesSourcePicker);
