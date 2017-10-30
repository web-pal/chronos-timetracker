// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import ModalDialog, { ModalFooter, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';
import Button, { ButtonGroup } from '@atlaskit/button';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { danger } from 'data/svg';
import { Flex } from 'components';
import { uiActions } from 'actions';
import { getConfirmDeleteWorklogModalOpen } from 'selectors';

import { DangerIcon, ModalContentContainer } from './styled';
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
    footer={() => (
      <ModalFooter>
        <Flex row style={{ justifyContent: 'flex-end', width: '100%' }}>
          <ButtonGroup>
            <Button
              appearance="warning"
              onClick={() => {
                confirmDeleteWorklog();
                setConfirmDeleteWorklogModalOpen(false);
              }}
            >
              Confirm
            </Button>
            <Button appearance="default" onClick={() => setConfirmDeleteWorklogModalOpen(false)}>
              Cancel
            </Button>
          </ButtonGroup>
        </Flex>
      </ModalFooter>
    )}
    header={() => (
      <ModalHeader>
        <ModalTitle>
          <DangerIcon src={danger} alt="Danger" />
          Confirm worklog removal
        </ModalTitle>
      </ModalHeader>
    )}
  >
    <ModalContentContainer>
      <p>
        Do you really want to delete worklog?
      </p>
    </ModalContentContainer>
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
