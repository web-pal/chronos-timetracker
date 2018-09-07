// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';
import type {
  Connector,
} from 'react-redux';
import type {
  Id,
  Dispatch,
} from 'types';

import ModalDialog from '@atlaskit/modal-dialog';

import {
  uiActions,
  worklogsActions,
} from 'actions';
import {
  getUiState,
  getModalState,
} from 'selectors';


type Props = {
  isOpen: boolean,
  worklogId: Id,
  dispatch: Dispatch,
};

const ConfirmDeleteWorklogModal: StatelessFunctionalComponent<Props> = ({
  isOpen,
  worklogId,
  dispatch,
}: Props): Node => isOpen && (
  <ModalDialog
    appearance="danger"
    heading="Delete worklog"
    onClose={() => {
      dispatch(uiActions.setModalState(
        'confirmDeleteWorklog',
        false,
      ));
    }}
    actions={[
      {
        text: 'Delete',
        onClick: () => {
          dispatch(worklogsActions.deleteWorklogRequest(worklogId));
          dispatch(uiActions.setModalState(
            'confirmDeleteWorklog',
            false,
          ));
        },
      },
      {
        text: 'Close',
        onClick: () => {
          dispatch(uiActions.setModalState(
            'confirmDeleteWorklog',
            false,
          ));
        },
      },
    ]}
  >
    <p>
      Are you sure you want to delete this worklog?
    </p>
  </ModalDialog>
);

function mapStateToProps(state) {
  return {
    isOpen: getModalState('confirmDeleteWorklog')(state),
    worklogId: getUiState('deleteWorklogId')(state),
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(ConfirmDeleteWorklogModal);
