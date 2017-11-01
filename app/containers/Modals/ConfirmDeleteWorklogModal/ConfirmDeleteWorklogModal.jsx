// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import ModalDialog from '@atlaskit/modal-dialog';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { uiActions } from 'actions';
import { getConfirmDeleteWorklogModalOpen } from 'selectors';

import type { SetConfirmDeleteWorklogModalOpen, ConfirmDeleteWorklog } from '../../../types';

type Props = {
  isOpen: boolean,
  setConfirmDeleteWorklogModalOpen: SetConfirmDeleteWorklogModalOpen,
  confirmDeleteWorklog: ConfirmDeleteWorklog,
};

const ConfirmDeleteWorklogModal: StatelessFunctionalComponent<Props> = ({
  isOpen,
  setConfirmDeleteWorklogModalOpen,
  confirmDeleteWorklog,
}: Props): Node => isOpen && (
  <ModalDialog
    onClose={() => setConfirmDeleteWorklogModalOpen(false)}
    appearance="danger"
    heading="Delete worklog"
    actions={[
      {
        text: 'Delete',
        onClick: () => {
          confirmDeleteWorklog();
          setConfirmDeleteWorklogModalOpen(false);
        },
      },
      {
        text: 'Close',
        onClick: () => setConfirmDeleteWorklogModalOpen(false),
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
    isOpen: getConfirmDeleteWorklogModalOpen(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...uiActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmDeleteWorklogModal);
