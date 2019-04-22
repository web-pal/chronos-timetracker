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
  worklogsActions,
  uiActions,
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
import * as S from './styled';


type Props = {
  isOpen: boolean,
  dispatch: Dispatch,
};

const SaveWorklogInetIssueModal: StatelessFunctionalComponent<Props> = ({
  isOpen,
  dispatch,
}: Props): Node => isOpen && (
  <ModalDialog
    shouldCloseOnOverlayClick={false}
    shouldCloseOnEscapePress={false}
    footer={() => (
      <ModalFooter>
        <Flex row style={{ justifyContent: 'flex-end', width: '100%' }}>
          <ButtonGroup>
            <Button
              appearance="warning"
              onClick={() => {
                dispatch(worklogsActions.stopTrySaveWorklogRequest());
                dispatch(uiActions.setModalState('worklogInetIssue', false));
              }}
            >
              {'I don\'t care, lost the worklog'}
            </Button>
            <Button
              appearance="primary"
              onClick={() => {
                dispatch(worklogsActions.trySaveWorklogAgainRequest());
                dispatch(uiActions.setModalState('worklogInetIssue', false));
              }}
            >
              Try again
            </Button>
          </ButtonGroup>
        </Flex>
      </ModalFooter>
    )}
    header={() => (
      <ModalHeader>
        <ModalTitle>
          <S.DangerIcon src={danger} alt="Danger" />
          Worklog would not be saved
        </ModalTitle>
      </ModalHeader>
    )}
  >
    <S.ModalContent>
      <p>
        Due to the internet connection, worklog cannot be saved.
        Fix your connection and click - Try again.
      </p>
    </S.ModalContent>
  </ModalDialog>
);

function mapStateToProps(state) {
  return {
    isOpen: getModalState('worklogInetIssue')(state),
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(SaveWorklogInetIssueModal);
