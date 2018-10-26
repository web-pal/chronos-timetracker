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
  Dispatch,
} from 'types';

import ModalDialog, {
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@atlaskit/modal-dialog';
import Button, {
  ButtonGroup,
} from '@atlaskit/button';

import {
  uiActions,
  timerActions,
} from 'actions';
import {
  getModalState,
} from 'selectors';

import {
  Flex,
} from 'components';
import {
  danger,
} from 'utils/data/svg';
import {
  DangerIcon,
  ModalContentContainer,
} from './styled';


type Props = {
  isOpen: boolean,
  dispatch: Dispatch,
};

const AlertModal: StatelessFunctionalComponent<Props> = ({
  isOpen,
  dispatch,
}: Props): Node => isOpen && (
  <ModalDialog
    onClose={() => {
      dispatch(uiActions.setModalState('alert', false));
    }}
    footer={() => (
      <ModalFooter>
        <Flex row style={{ justifyContent: 'flex-end', width: '100%' }}>
          <ButtonGroup>
            <Button
              appearance="warning"
              onClick={() => {
                // !! important to call stopTimer before setAlertModalOpen because of saga logic
                // see sagas/timer:144-149
                dispatch(timerActions.stopTimer());
                dispatch(uiActions.setModalState('alert', false));
              }}
            >
              Stop timer
            </Button>
            <Button
              appearance="default"
              onClick={() => {
                dispatch(timerActions.continueTimer());
                dispatch(uiActions.setModalState('alert', false));
              }}
            >
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
    isOpen: getModalState('alert')(state),
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(AlertModal);
