// TODO. save "Remember my choice"
import React from 'react';
import ModalDialog from '@atlaskit/modal-dialog';
import ButtonGroup from '@atlaskit/button-group';
import Button from '@atlaskit/button';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DropdownItemCheckbox } from '@atlaskit/dropdown-menu';
import { danger } from 'data/svg';

import * as uiActions from '../../../actions/ui';

import Flex from '../../../components/Base/Flex/Flex';
import { DangerIcon } from './styled';
import { H700 } from '../../../styles/typography';
import {
  ModalContentContainer,
} from '../../../styles/modals';

// eslint-disable-next-line
const AboutModal = ({ isOpen, setShowAlertModal }) => (
  <ModalDialog
    onDialogDismissed={() => setShowAlertModal(false)}
    isOpen={isOpen}
    footer={(
      <Flex row style={{ justifyContent: 'flex-end' }}>
        <ButtonGroup>
          <Button appearance="warning">
            Stop timer
          </Button>
          <Button appearance="default">
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

function mapStateToProps({ ui }) {
  return {
    isOpen: ui.showAlertModal,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(uiActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutModal);
