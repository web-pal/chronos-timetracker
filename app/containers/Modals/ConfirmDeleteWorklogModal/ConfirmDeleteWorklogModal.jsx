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
  uiActions,
  worklogsActions,
} from 'actions';
import {
  getConfirmDeleteWorklogModalOpen,
  getUiState,
  getModalState,
} from 'selectors';
import ModalDialog from '@atlaskit/modal-dialog';

import type {
  SetConfirmDeleteWorklogModalOpen,
  ConfirmDeleteWorklog,
} from '../../../types';


type Props = {
  isOpen: boolean,
  setConfirmDeleteWorklogModalOpen: SetConfirmDeleteWorklogModalOpen,
  confirmDeleteWorklog: ConfirmDeleteWorklog,
};

const ConfirmDeleteWorklogModal: StatelessFunctionalComponent<Props> = ({
  isOpen,
  worklogId,
  setConfirmDeleteWorklogModalOpen,
  confirmDeleteWorklog,
  setModalState,
  deleteWorklogRequest,
}: Props): Node => isOpen && (
  <ModalDialog
    onClose={() => setModalState('confirmDeleteWorklog', false)}
    appearance="danger"
    heading="Delete worklog"
    actions={[
      {
        text: 'Delete',
        onClick: () => {
          deleteWorklogRequest(worklogId);
          setModalState('confirmDeleteWorklog', false);
        },
      },
      {
        text: 'Close',
        onClick: () => setModalState('confirmDeleteWorklog', false),
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...uiActions,
    ...worklogsActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmDeleteWorklogModal);
