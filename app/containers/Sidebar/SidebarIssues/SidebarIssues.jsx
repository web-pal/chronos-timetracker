// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';
import {
  bindActionCreators,
} from 'redux';
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

import {
  getSidebarIssues2,
  getSelectedIssueId,
  getTrackingIssueId,
  getSidebarFiltersOpen,
  getResourceMeta,
  getUiState,
} from 'selectors';
import {
  IssueItemPlaceholder,
} from 'components';
import {
  issuesActions,
  resourcesActions,
} from 'actions';
import type {
  IssuesMap,
  FetchIssuesRequest,
  SelectIssue,
  Issue,
  Id,
} from '../../../types';
import {
  ListContainer,
} from './styled';

import IssuesHeader from './IssuesHeader';
import IssueItem from './IssueItem';
import NoIssues from './NoIssues';
import Filters from './Filters';


type Props = {
  issues: IssuesMap,
  issuesFetching: boolean,
  projectsFetching: boolean,
  sidebarFiltersOpen: boolean,
  totalCount: number,
  selectedIssueId: Id | null,
  trackingIssueId: Id | null,
  fetchIssuesRequest: FetchIssuesRequest,
  selectIssue: SelectIssue,
  saveLastRenderedIndex: ({ startIndex: number, stopIndex: number }) => void,
  saveOnRowsRenderedFunction: (Function) => void,
  registerInfiniteNode: (Function) => void,
};

const SidebarAllItems: StatelessFunctionalComponent<Props> = ({
  issues,
  issuesFetching,
  projectsFetching,
  sidebarFiltersIsOpen,
  totalCount,
  selectedIssueId,
  trackingIssueId,
  fetchIssuesRequest,
  selectIssue,
  saveLastRenderedIndex,
  saveOnRowsRenderedFunction,
  registerInfiniteNode,
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
      threshold={20}
      loadMoreRows={({ startIndex, stopIndex }) =>
        new Promise((resolve) => {
          fetchIssuesRequest({
            startIndex,
            stopIndex,
            resolve,
            search: false,
          });
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
                      {item ?
                        <IssueItem
                          issue={item}
                          active={selectedIssueId === item.id}
                          tracking={trackingIssueId === item.id}
                          selectIssue={selectIssue}
                        /> :
                        <IssueItemPlaceholder />
                      }
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
    issues: getSidebarIssues2(state),
    projectsFetching,
    issuesFetching,
    totalCount,
    selectedIssueId: getSelectedIssueId(state),
    trackingIssueId: getTrackingIssueId(state),
    refetchFilterIssuesMarker: getResourceMeta(
      'issues',
      'refetchFilterIssuesMarker',
    )(state),
    sidebarFiltersIsOpen: getUiState('sidebarFiltersIsOpen')(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...issuesActions,
    ...resourcesActions,
  }, dispatch);
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
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
        this.props.setResourceMeta({
          resourceName: 'issues',
          meta: {
            refetchFilterIssuesMarker: false,
          },
        });
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
