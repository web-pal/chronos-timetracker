import React from 'react';
import ModalDialog from '@atlaskit/modal-dialog';
import ButtonGroup from '@atlaskit/button-group';
import Button from '@atlaskit/button';
import { paperClip } from 'data/svg';

import Flex from '../../../components/Base/Flex/Flex';
import {
  TextInput,
  FeedbackTextarea,
  AttachmentsButton,
  AttachmentsIcon,
} from './styled';

import { H700, H200 } from '../../../styles/typography';

// eslint-disable-next-line
export default ({ isOpen, onClose }) => (
  <ModalDialog
    onDialogDismissed={onClose}
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
