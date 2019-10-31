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

import StarIcon from '@atlaskit/icon/glyph/star';
import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';

import type {
  Dispatch,
  SelectedOption,
} from 'types';

import {
  SingleSelect,
  Flex,
} from 'components';

import {
  getIssuesSourceOptions,
  getSelectedSprintOption,
  getSprintsOptions,
  getIssuesSourceSelectedOption,
  getUiState,
  getResourceIds,
} from 'selectors';

import {
  issuesActions,
  sprintsActions,
  resourcesActions,
  uiActions,
} from 'actions';

import createActionCreators from 'redux-resource-action-creators';

import JQLFilter from './JQLFilter';

import * as S from './styled';

type Props = {
  options: Array<any>,
  sprintsOptions: Array<any>,
  selectedOption: SelectedOption,
  selectedSprintOption: any,
  projectsFetching: boolean,
  favoriteProjectsIds: Array<string>,
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
  favoriteProjectsIds,
  sprintsFetching,
  selectedSourceType,
  dispatch,
}: Props): Node => (
  <S.IssuesSource>
    <Flex row alignItems="center">
      <S.SingleSelectContainer>
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
            const sources = {
              issuesSprintId: null,
              issuesSourceId: item.value,
              issuesSourceType: type,
            };
            const filterKey = (
              `${sources.issuesSourceType}_${sources.issuesSourceId}_${sources.issuesSprintId}`
            );
            dispatch(uiActions.setUiState({
              ...sources,
              sidebarFiltersIsOpen: false,
            }));

            dispatch(uiActions.setUiState({
              [filterKey]: {
                type: [],
                status: [],
                assignee: [],
              },
            }));

            if (type === 'scrum') {
              dispatch(resourcesActions.clearResourceList({
                resourceType: 'issues',
                list: 'recentIssues',
              }));
              dispatch(sprintsActions.fetchSprintsRequest());
            } else if (item.value) {
              dispatch(uiActions.setUiState({
                filterStatusesIsFetched: false,
              }));
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
      </S.SingleSelectContainer>
      {
        selectedOption && (selectedSourceType === 'project')
        && (
          <S.FavoriteIcon
            onClick={() => {
              const index = favoriteProjectsIds.indexOf(selectedOption.value);
              const favorited = index !== -1;
              if (favorited) {
                favoriteProjectsIds.splice(index, 1);
              } else {
                favoriteProjectsIds.push(selectedOption.value);
              }
              dispatch(createActionCreators('update', {
                resourceType: 'projects',
                resources: favoriteProjectsIds,
                list: 'favorites',
                mergeListIds: false,
              }).succeeded());
            }}
          >
            {
              favoriteProjectsIds.indexOf(selectedOption.value) !== -1
                ? (
                  <StarFilledIcon
                    size="large"
                    label="FAVORITE"
                    primaryColor="#6B778C"
                  />
                )
                : (
                  <StarIcon
                    size="large"
                    label="FAVORITE"
                    primaryColor="#6B778C"
                  />
                )
            }
          </S.FavoriteIcon>
        )
      }
    </Flex>
    { (selectedSourceType === 'scrum')
      && (
      <SingleSelect
        items={sprintsOptions}
        hasAutocomplete
        selectedItem={selectedSprintOption}
        defaultSelected={selectedSprintOption || undefined}
        placeholder="Select sprint"
        onSelected={({ item }) => {
          dispatch(uiActions.setUiState({
            issuesSprintId: item.value,
            sidebarFiltersIsOpen: false,
          }));
          dispatch(issuesActions.refetchIssuesRequest());
        }}
        isLoading={sprintsFetching}
        loadingMessage="Fetching sprints..."
        shouldFitContainer
        noMatchesFound="Nothing found"
      />
      )
    }
    {
      selectedSourceType === 'filter' && (
        <JQLFilter selectedFilter={selectedOption} />
      )
    }
  </S.IssuesSource>
);

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
    favoriteProjectsIds: getResourceIds('projects', 'favorites')(state),
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
