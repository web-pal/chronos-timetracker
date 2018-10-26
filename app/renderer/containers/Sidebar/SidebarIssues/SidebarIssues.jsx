// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';
import {
  InfiniteLoader,
  AutoSizer,
  List,
} from 'react-virtualized';
import {
  compose,
  withHandlers,
  lifecycle,
} from 'recompose';
import {
  getStatus as getResourceStatus,
} from 'redux-resource';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';
import type {
  Id,
  Dispatch,
  Issue,
} from 'types';

import {
  getSidebarIssues,
  getResourceMeta,
  getUiState,
} from 'selectors';
import {
  IssueItemPlaceholder,
  ErrorBoundary,
} from 'components';
import {
  issuesActions,
  uiActions,
  resourcesActions,
} from 'actions';
import {
  ListContainer,
} from './styled';

import IssuesHeader from './IssuesHeader';
import IssueItem from './IssueItem';
import NoIssues from './NoIssues';
import Filters from './Filters';


type Props = {
  issues: Array<Issue>,
  issuesFetching: boolean,
  projectsFetching: boolean,
  sidebarFiltersIsOpen: boolean,
  totalCount: number,
  selectedIssueId: Id | null,
  trackingIssueId: Id | null,
  saveLastRenderedIndex: ({
    startIndex: number,
    stopIndex: number,
  }) => void,
  saveOnRowsRenderedFunction: (Function) => void,
  registerInfiniteNode: () => void,
  dispatch: Dispatch,
};

const SidebarAllItems: StatelessFunctionalComponent<Props> = ({
  issues,
  issuesFetching,
  projectsFetching,
  sidebarFiltersIsOpen,
  totalCount,
  selectedIssueId,
  trackingIssueId,
  saveLastRenderedIndex,
  saveOnRowsRenderedFunction,
  registerInfiniteNode,
  dispatch,
}: Props): Node =>
  <ListContainer>
    <IssuesHeader />
    {sidebarFiltersIsOpen &&
      <Filters />
    }
    <InfiniteLoader
      isRowLoaded={({ index }) => !!issues[index]}
      rowCount={totalCount}
      ref={registerInfiniteNode}
      minimumBatchSize={50}
      loadMoreRows={({ startIndex, stopIndex }) =>
        new Promise((resolve) => {
          dispatch(issuesActions.fetchIssuesRequest({
            startIndex,
            stopIndex,
            resolve,
          }));
        })
      }
    >
      {({
        onRowsRendered,
        registerChild,
      }) => {
        saveOnRowsRenderedFunction(onRowsRendered);
        return (
          <AutoSizer>
            {({ height, width }) => (
              <List
                width={width}
                height={height - 39}
                registerChild={registerChild}
                onRowsRendered={(data) => {
                  saveLastRenderedIndex(data);
                  onRowsRendered(data);
                }}
                noRowsRenderer={() => <NoIssues />}
                scrollToAlignment="center"
                rowCount={
                  (totalCount === 0 && (issuesFetching || projectsFetching)) ? 10 : totalCount
                }
                rowHeight={101}
                rowRenderer={({ index, key, style }) => {
                  const item: ?Issue = issues[index];
                  return (
                    <div style={style} key={key}>
                      <ErrorBoundary debugData={item}>
                        {(item && item !== 'pending') ?
                          <IssueItem
                            issue={item}
                            active={selectedIssueId === item.id}
                            tracking={trackingIssueId === item.id}
                            selectIssue={(issueId) => {
                              dispatch(
                                uiActions.setUiState('selectedIssueId', issueId),
                              );
                              dispatch(
                                uiActions.setUiState('selectedWorklogId', null),
                              );
                            }}
                          /> :
                          <IssueItemPlaceholder />
                        }
                      </ErrorBoundary>
                    </div>
                  );
                }}
              />
            )}
          </AutoSizer>
        );
      }}
    </InfiniteLoader>
  </ListContainer>;

function mapStateToProps(state) {
  const projectsFetching = getResourceStatus(
    state,
    'projects.requests.allProjects.status',
  ).pending;
  const issuesFetching = getResourceStatus(
    state,
    'issues.requests.filterIssues.status',
  ).pending;
  const totalCount = getResourceMeta(
    'issues',
    'filterIssuesTotalCount',
  )(state);
  return {
    issues: getSidebarIssues(state),
    projectsFetching,
    issuesFetching,
    totalCount,
    selectedIssueId: getUiState('selectedIssueId')(state),
    trackingIssueId: getUiState('trackingIssueId')(state),
    refetchFilterIssuesMarker: getResourceMeta(
      'issues',
      'refetchFilterIssuesMarker',
    )(state),
    sidebarFiltersIsOpen: getUiState('sidebarFiltersIsOpen')(state),
  };
}

export default compose(
  connect(
    mapStateToProps,
    dispatch => ({ dispatch }),
  ),
  withHandlers(() => {
    let infiniteNode;
    let onRowsRendered;
    let lastRenderedRows = {
      startIndex: 0,
      stopIndex: 10,
    };
    return {
      saveLastRenderedIndex: () => (data) => {
        lastRenderedRows = data;
      },
      registerInfiniteNode: () => (ref) => {
        infiniteNode = ref;
      },
      saveOnRowsRenderedFunction: () => (f) => {
        onRowsRendered = f;
      },
      resetLoadMoreRowsCache: () => () =>
        infiniteNode.resetLoadMoreRowsCache(),
      tellInfiniteLoaderToLoadRows: () => () =>
        onRowsRendered(lastRenderedRows),
    };
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (nextProps.refetchFilterIssuesMarker && !this.props.refetchFilterIssuesMarker) {
        this.props.dispatch(resourcesActions.setResourceMeta({
          resourceType: 'issues',
          meta: {
            refetchFilterIssuesMarker: false,
          },
        }));
        this.props.resetLoadMoreRowsCache();
        setTimeout(() => {
          if (this.props.tellInfiniteLoaderToLoadRows) {
            this.props.tellInfiniteLoaderToLoadRows();
          }
        }, 100);
      }
    },
  }),
)(SidebarAllItems);
