// @flow
import React from 'react';
import InlineDialog from '@atlaskit/inline-dialog';
import { connect } from 'react-redux';
import { FieldTextStateless as FieldText } from '@atlaskit/field-text';
import Spinner from '@atlaskit/spinner';
import Button from '@atlaskit/button';
import { Flex } from 'components';

import {
  getUiState,
  getResourceStatus,
} from 'selectors';

import {
  filtersActions,
  uiActions,
} from 'actions';

import type {
  Dispatch,
  SelectedOption,
} from 'types';

import * as R from 'ramda';

import { InputLabel } from './styled';

type Props = {
  newJQLFilterName: string | null,
  newJQLFilterValue: string | null,
  newJQLFilterErrors: Array<any>,
  newJQLFilterSaving: boolean,
  newJQLFilterAdding: boolean,
  saveFilterDialogOpen: boolean,
  selectedFilter: SelectedOption,
  dispatch: Dispatch,
}

const JQLFilter = ({
  newJQLFilterName,
  newJQLFilterValue,
  newJQLFilterErrors,
  newJQLFilterSaving,
  newJQLFilterAdding,
  saveFilterDialogOpen,
  selectedFilter,
  dispatch,
}: Props) => (
  <Flex column style={{ marginTop: 8 }}>
    <FieldText
      value={newJQLFilterValue !== null ? newJQLFilterValue : R.path(['meta', 'filter', 'jql'], selectedFilter)}
      isInvalid={newJQLFilterErrors.length > 0}
      isLabelHidden
      invalidMessage={newJQLFilterErrors.join(', ')}
      onChange={(e) => {
        dispatch(uiActions.setUiState('newJQLFilterErrors', []));
        if (e.target.value === R.path(['meta', 'filter', 'jql'], selectedFilter)) {
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
            <InputLabel>New filter name</InputLabel>
            <Flex alignItems="center">
              <FieldText
                placeholder="New filter name"
                isLabelHidden
                value={newJQLFilterName}
                onChange={e => dispatch(uiActions.setUiState('newJQLFilterName', e.target.value))}
                shouldFitContainer
              />
              <Button
                appearance="link"
                iconAfter={newJQLFilterAdding ? <Spinner /> : null}
                onClick={() => dispatch(
                  filtersActions.createFilterRequest({
                    name: newJQLFilterName,
                    jql: newJQLFilterValue,
                  }),
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
        onClick={() => dispatch(
          filtersActions.updateFilterRequest({
            oldFilter: selectedFilter.meta.filter,
            newJQLString: newJQLFilterValue,
          }),
        )}
        isDisabled={!newJQLFilterValue}
        iconAfter={newJQLFilterSaving ? <Spinner /> : null}
      >
        Save
      </Button>
      <Button
        appearance="subtle-link"
        isDisabled={newJQLFilterValue === null}
        onClick={() => dispatch(uiActions.setUiState('newJQLFilterValue', null))}
      >
        Reset
      </Button>
    </Flex>
  </Flex>
);

const connector = connect(
  state => ({
    newJQLFilterName: getUiState('newJQLFilterName')(state),
    newJQLFilterValue: getUiState('newJQLFilterValue')(state),
    newJQLFilterSaving: getResourceStatus(
      state,
      'filters.requests.updateFilter.status',
    ).pending,
    newJQLFilterAdding: getResourceStatus(
      state,
      'filters.requests.createFilter.status',
    ).pending,
    newJQLFilterErrors: getUiState('newJQLFilterErrors')(state),
    saveFilterDialogOpen: getUiState('saveFilterDialogOpen')(state),
  }),
  dispatch => ({ dispatch }),
);

export default connector(JQLFilter);
