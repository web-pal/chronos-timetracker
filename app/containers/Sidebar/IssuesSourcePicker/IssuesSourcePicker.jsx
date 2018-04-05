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
  Flex,
} from 'components';

import { FieldTextStateless as FieldText } from '@atlaskit/field-text';

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
  filtersActions,
  resourcesActions,
  uiActions,
} from 'actions';

import InlineDialog from '@atlaskit/inline-dialog';

import Button from '@atlaskit/button';

import * as R from 'ramda';

import {
  InputLabel,
  IssuesSourceContainer,
} from './styled';


type Props = {
  options: Array<any>,
  sprintsOptions: Array<any>,
  selectedOption: SelectedOption,
  selectedSprintOption: any,
  projectsFetching: boolean,
  sprintsFetching: boolean,
  selectedSourceType: string,
  newJQLFilterName: string | null,
  newJQLFilterValue: string | null,
  newJQLFilterErrors: Array<any>,
  saveFilterDialogOpen: boolean,
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
  newJQLFilterName,
  newJQLFilterValue,
  newJQLFilterErrors,
  saveFilterDialogOpen,
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
            resourceName: 'issues',
            list: 'recentIssues',
          }));
          dispatch(sprintsActions.fetchSprintsRequest());
        } else if (item.value) {
          dispatch(uiActions.setUiState('filterStatusesIsFetched', false));
          dispatch(resourcesActions.clearResourceList({
            resourceName: 'issues',
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
    {console.log(selectedOption)}
    { (selectedSourceType === 'filter') &&
      <Flex column style={{ marginTop: 8 }}>
        <FieldText
          value={newJQLFilterValue || R.path(['meta', 'filter', 'jql'], selectedOption)}
          isInvalid={newJQLFilterErrors.length > 0}
          isLabelHidden
          invalidMessage={newJQLFilterErrors.join(', ')}
          onChange={(e) => {
            if (e.target.value === R.path(['meta', 'filter', 'jql'], selectedOption)) {
              dispatch(uiActions.setUiState('newJQLFilterValue', null));
            } else {
              dispatch(uiActions.setUiState('newJQLFilterValue', e.target.value));
            }
          }}
          shouldFitContainer
        />
        <Flex justifyContent="flex-end">
          <InlineDialog
            isOpen={saveFilterDialogOpen}
            onClose={() => dispatch(uiActions.setUiState('saveFilterDialogOpen', false))}
            content={
              <Flex column>
                <Flex alignItems="center">
                  <FieldText
                    placeholder="New filter name"
                    label="New filter name"
                    value={newJQLFilterName}
                    onChange={e => dispatch(uiActions.setUiState('newJQLFilterName', e.target.value))}
                    shouldFitContainer
                  />
                  <Button
                    appearance="link"
                    onClick={() => dispatch(
                      filtersActions.createFilterRequest({
                        name: newJQLFilterName,
                        jql: newJQLFilterValue,
                      })
                    )}
                  >
                    Save
                  </Button>
                </Flex>
              </Flex>
            }
          >
            <Button
              appearance="link"
              onClick={() => dispatch(uiActions.setUiState('saveFilterDialogOpen', !saveFilterDialogOpen))}
              isDisabled={!newJQLFilterValue}
            >
              New
            </Button>
          </InlineDialog>
          <Button
            appearance="link"
            isDisabled={!newJQLFilterValue}
          >
            Save
          </Button>
          <Button
            appearance="subtle-link"
            isDisabled={!newJQLFilterValue}
            onClick={() => dispatch(uiActions.setUiState('newJQLFilterValue', null))}
          >
            Reset
          </Button>
        </Flex>
      </Flex>
    }
  </IssuesSourceContainer>;

function mapStateToProps(state) {
  return {
    options: getIssuesSourceOptions(state),
    selectedOption: getIssuesSourceSelectedOption(state),
    selectedSourceType: getUiState('issuesSourceType')(state),
    newJQLFilterName: getUiState('newJQLFilterName')(state),
    newJQLFilterValue: getUiState('newJQLFilterValue')(state),
    newJQLFilterErrors: getUiState('newJQLFilterErrors')(state),
    saveFilterDialogOpen: getUiState('saveFilterDialogOpen')(state),

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
