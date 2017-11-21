// CAUTION! not migrated to 3.*.* version
// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import ModalDialog from '@atlaskit/modal-dialog';
import Button, { ButtonGroup } from '@atlaskit/button';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { paperClip } from 'data/svg';
import { H700, H200 } from 'styles/typography';
import { Flex } from 'components';
import { uiActions } from 'actions';
import { getSupportModalOpen } from 'selectors';

import {
  TextInput,
  FeedbackTextarea,
  AttachmentsButton,
  AttachmentsIcon,
} from './styled';

import type { SetSupportModalOpen } from '../../../types';

type Props = {
  isOpen: boolean,
  setSupportModalOpen: SetSupportModalOpen,
};

/* eslint-disable indent */ // buggy rule
const SupportModal: StatelessFunctionalComponent<Props> = ({
  isOpen,
  setSupportModalOpen,
}): Node => isOpen &&
  <ModalDialog
    footer={(
      <Flex row style={{ justifyContent: 'flex-end' }}>
        <ButtonGroup>
          <Button appearance="primary">
            Submit
          </Button>
          <Button appearance="subtle" onClick={() => setSupportModalOpen(false)}>
            Close
          </Button>
        </ButtonGroup>
      </Flex>
    )}
    onClose={() => setSupportModalOpen(false)}
  >
    <Flex column style={{ margin: '20px 10px 10px 4px' }}>
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
  </ModalDialog>;

function mapStateToProps(state) {
  return {
    isOpen: getSupportModalOpen(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(uiActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SupportModal);
