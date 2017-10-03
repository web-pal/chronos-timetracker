// @flow
// TODO. save "Remember my choice"
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import ModalDialog from '@atlaskit/modal-dialog';
import ButtonGroup from '@atlaskit/button-group';
import Button from '@atlaskit/button';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DropdownItemCheckbox } from '@atlaskit/dropdown-menu';
import { danger } from 'data/svg';
import { H700 } from 'styles/typography';
import { Flex } from 'components';
import { uiActions, timerActions } from 'actions';
import { getAlertModalOpen } from 'selectors';

import { DangerIcon, ModalContentContainer } from './styled';
import type { SetAlertModalOpen } from '../../../types';

type Props = {
  isOpen: boolean,
  setAlertModalOpen: SetAlertModalOpen,
  // TODO stopTimer type
  stopTimer: any,
};

const AlertModal: StatelessFunctionalComponent<Props> = ({
  isOpen,
  setAlertModalOpen,
  stopTimer
}: Props): Node => (
  <ModalDialog
    isOpen={isOpen}
    onClose={() => setAlertModalOpen(false)}
    onDialogDismissed={() => setAlertModalOpen(false)}
    footer={(
      <Flex row style={{ justifyContent: 'flex-end' }}>
        <ButtonGroup>
          <Button
            appearance="warning"
            onClick={() => {
              setAlertModalOpen(false);
              stopTimer();
            }}
          >
            Stop timer
          </Button>
          <Button appearance="default" onClick={() => setAlertModalOpen(false)}>
            Continue tracking
          </Button>
        </ButtonGroup>
      </Flex>
    )}
  >
    <ModalContentContainer>
      <H700>
        <DangerIcon src={danger} alt="Danger" />
        Time would not be saved
      </H700>
      <p>
        Worklogs under 1 minute can not be saved in JIRA.
        Do you want to stop timer or continue tracking?
      </p>
      <Flex style={{ marginLeft: -8, marginTop: 5 }}>
        <DropdownItemCheckbox>
          Remember my choice
        </DropdownItemCheckbox>
      </Flex>
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
