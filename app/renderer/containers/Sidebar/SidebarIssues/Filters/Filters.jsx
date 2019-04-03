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
  Filter,
} from 'types';

import Button, {
  ButtonGroup,
} from '@atlaskit/button';
import {
  PopupSelect,
} from '@atlaskit/select';
import HipchatChevronDownIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';
import ArrowDownIcon from '@atlaskit/icon/glyph/arrow-down';
import ArrowUpIcon from '@atlaskit/icon/glyph/arrow-up';
import Spinner from '@atlaskit/spinner';

import {
  issuesActions,
  uiActions,
} from 'actions';
import {
  getResourceMeta,
  getFilterOptions,
  getIssuesOrderableOptions,
  getUiState,
} from 'selectors';
import {
  FullPageSpinner,
  Flex,
} from 'styles';
import {
  H200,
} from 'styles/typography';

import * as S from './styled';
import FilterOption from './FilterOption';


type Props = {
  filters: Filter,
  options: Array<any>,
  orderableFields: Array<any>,
  issuesCount: number,
  issuesFetching: boolean,
  optionsFetching: boolean,
  filterKey: string,
  dispatch: Dispatch,
};

const SidebarFilters: StatelessFunctionalComponent<Props> = ({
  filters,
  options,
  orderableFields,
  issuesCount,
  issuesFetching,
  optionsFetching,
  filterKey,
  dispatch,
}: Props): Node => (
  <S.Filters>
    {optionsFetching
      ? (
        <FullPageSpinner>
          <Spinner size="xlarge" />
        </FullPageSpinner>
      ) : (
        <S.FilterItems>
          <S.FilterItem>
            <Flex padding="10px 0 0 10px" align="center" width="100%" spacing={4}>
              <H200>
                Order by {filters?.orderBy?.label || 'Created'}
              </H200>
              <Flex
                clickable
                onClick={() => {
                  dispatch(uiActions.setUiState('issuesFilters', {
                    [filterKey]: {
                      _merge: true,
                      orderType: (
                        filters?.orderType === 'DESC'
                          ? 'ASC'
                          : 'DESC'
                      ),
                    },
                  }));
                  dispatch(issuesActions.refetchIssuesRequest(true));
                }}
              >
                {
                  filters?.orderType === 'DESC'
                    ? (
                      <ArrowDownIcon size="small" label="DESC" primaryColor="#6B778C" />
                    ) : (
                      <ArrowUpIcon size="small" label="ASC" primaryColor="#6B778C" />
                    )
                }
              </Flex>
              <PopupSelect
                onChange={(option) => {
                  dispatch(uiActions.setUiState('issuesFilters', {
                    [filterKey]: {
                      _merge: true,
                      orderBy: option,
                    },
                  }));
                  dispatch(issuesActions.refetchIssuesRequest(true));
                }}
                target={({ ref }) => (
                  <Flex
                    clickable
                    background="#f6f6f6"
                    borderRadius="3px"
                    innerRef={ref}
                  >
                    <HipchatChevronDownIcon size="small" label="Order" primaryColor="#6B778C" />
                  </Flex>
                )}
                options={orderableFields}
                placeholder="Search"
              />
            </Flex>
          </S.FilterItem>
          {options.map(type => (
            <S.FilterItem key={type.key}>
              <S.FilterName>
                {type.name}
              </S.FilterName>
              <S.FilterOptions>
                {type.options.map(option => (
                  <FilterOption
                    key={option.id}
                    option={option}
                    isChecked={(filters[type.key] || []).includes(option.id)}
                    onChange={(value, checked) => {
                      if (type.key === 'assignee') {
                        dispatch(uiActions.setUiState('issuesFilters', {
                          [filterKey]: {
                            _merge: true,
                            [type.key]: [!checked && value].filter(Boolean),
                          },
                        }));
                      } else {
                        dispatch(uiActions.setUiState('issuesFilters', {
                          [filterKey]: {
                            _merge: true,
                            [type.key]: (
                              !checked
                                ? [...filters[type.key] || [], value]
                                : (filters[type.key] || []).filter(f => f !== value)
                            ),
                          },
                        }));
                      }
                      dispatch(issuesActions.refetchIssuesRequest(true));
                    }}
                    showIcons={type.showIcons}
                  />
                ))}
              </S.FilterOptions>
            </S.FilterItem>
          ))}
        </S.FilterItems>
      )
    }
    <S.FilterActions>
      <S.IssuesFound>
        <S.IssuesFoundText>
          Issues found:
        </S.IssuesFoundText>
        {issuesFetching
          ? <Spinner size="small" />
          : <span>{issuesCount}</span>
        }
      </S.IssuesFound>
      <ButtonGroup>
        <Button
          onClick={() => {
            dispatch(uiActions.setUiState({
              issuesFilters: {
                [filterKey]: {
                  assignee: [],
                  status: [],
                  type: [],
                },
              },
            }));
            dispatch(issuesActions.refetchIssuesRequest());
          }}
        >
          Clear filters
        </Button>
        <Button
          appearance="primary"
          onClick={() => {
            dispatch(uiActions.setUiState({
              sidebarFiltersIsOpen: false,
            }));
          }}
        >
          Close
        </Button>
      </ButtonGroup>
    </S.FilterActions>
  </S.Filters>
);

function mapStateToProps(state) {
  const {
    issuesSourceType,
    issuesSourceId,
    issuesSprintId,
  } = getUiState([
    'issuesSourceType',
    'issuesSourceId',
    'issuesSprintId',
  ])(state);
  const filterKey = `${issuesSourceType}_${issuesSourceId}_${issuesSprintId}`;
  return {
    options: getFilterOptions(state),
    orderableFields: getIssuesOrderableOptions(state),
    optionsFetching: getResourceStatus(
      state,
      'issuesTypes.requests.issuesTypes.status',
    ).pending,
    filters: (
      getUiState('issuesFilters')(state)[filterKey]
      || ({
        type: [],
        status: [],
        assignee: [],
        orderBy: null,
        orderType: 'DESC',
      })
    ),
    filterKey,
    issuesCount: getResourceMeta(
      'issues',
      'filterIssuesTotalCount',
    )(state),
    issuesFetching: getResourceStatus(
      state,
      'issues.requests.filterIssues.status',
    ).pending,
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(SidebarFilters);
