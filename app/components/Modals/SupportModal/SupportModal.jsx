import React from 'react';
import ModalDialog from '@atlaskit/modal-dialog';
import ButtonGroup from '@atlaskit/button-group';
import Button from '@atlaskit/button';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { paperClip } from 'data/svg';

import * as uiActions from '../../../actions/ui';

import Flex from '../../../components/Base/Flex/Flex';
import {
  TextInput,
  FeedbackTextarea,
  AttachmentsButton,
  AttachmentsIcon,
} from './styled';

import { H700, H200 } from '../../../styles/typography';

// eslint-disable-next-line
const SupportModal = ({ isOpen, setShowSupportModal }) => (
  <ModalDialog
    onDialogDismissed={() => setShowSupportModal(false)}
    isOpen={isOpen}
    footer={(
      <Flex row style={{ justifyContent: 'flex-end' }}>
        <ButtonGroup>
          <Button appearance="primary">
            Submit
          </Button>
          <Button appearance="subtle">
            Close
          </Button>
        </ButtonGroup>
      </Flex>
    )}
  >
    <Flex column style={{ margin: '20px 10px 10px 10px' }}>
      <H700 style={{ marginBottom: 28 }}>Have a question?</H700>
      <H200>Your email</H200>
      <TextInput type="text" value="ignatif@gmail.com" />
      <H200>Your question</H200>
      <FeedbackTextarea />
      <AttachmentsButton>
        <AttachmentsIcon src={paperClip} alt="" />
        Add attachments
      </AttachmentsButton>
    </Flex>
  </ModalDialog>
);

function mapStateToProps({ ui }) {
  return {
    isOpen: ui.showSupportModal,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(uiActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SupportModal);
