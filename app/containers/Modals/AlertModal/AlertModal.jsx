// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import ModalDialog, { ModalFooter, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';
import Button, { ButtonGroup } from '@atlaskit/button';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { danger } from 'data/svg';
import { Flex } from 'components';
import { uiActions, timerActions } from 'actions';
import { getAlertModalOpen } from 'selectors';

import { DangerIcon, ModalContentContainer } from './styled';
import type { SetAlertModalOpen, StopTimer } from '../../../types';

type Props = {
  isOpen: boolean,
  setAlertModalOpen: SetAlertModalOpen,
  stopTimer: StopTimer,
};

const AlertModal: StatelessFunctionalComponent<Props> = ({
  isOpen,
  setAlertModalOpen,
  stopTimer,
}: Props): Node => isOpen && (
  <ModalDialog
    onClose={() => setAlertModalOpen(false)}
    footer={() => (
      <ModalFooter>
        <Flex row style={{ justifyContent: 'flex-end', width: '100%' }}>
          <ButtonGroup>
            <Button
              appearance="warning"
              onClick={() => {
                // !! important to call stopTimer before setAlertModalOpen because of saga logic
                // see sagas/timer:144-149
                stopTimer();
                //
                setAlertModalOpen(false);
              }}
            >
              Stop timer
            </Button>
            <Button appearance="default" onClick={() => setAlertModalOpen(false)}>
              Continue tracking
            </Button>
          </ButtonGroup>
        </Flex>
      </ModalFooter>
    )}
    header={() => (
      <ModalHeader>
        <ModalTitle>
          <DangerIcon src={danger} alt="Danger" />
          Time would not be saved
        </ModalTitle>
      </ModalHeader>
    )}
  >
    <ModalContentContainer>
      <p>
        Worklogs under 1 minute can not be saved in JIRA.
        Do you want to stop timer or continue tracking?
      </p>
    </ModalContentContainer>
  </ModalDialog>
);

function mapStateToProps(state) {
  return {
    isOpen: getAlertModalOpen(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...uiActions, ...timerActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AlertModal);
