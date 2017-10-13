// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import ModalDialog from '@atlaskit/modal-dialog';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import { bindActionCreators } from 'redux';
import { Flex } from 'components';
import { Button } from 'styles/buttons';
import { uiActions } from 'actions';
import { getAboutModalOpen } from 'selectors';

import type { SetAboutModalOpen, SetAlertModalOpen, SetWorklogModalOpen } from '../../../types';

type Props = {
  isOpen: boolean,
  setAboutModalOpen: SetAboutModalOpen,
  setAlertModalOpen: SetAlertModalOpen,
  setWorklogModalOpen: SetWorklogModalOpen,
};

const AboutModal: StatelessFunctionalComponent<Props> = ({
  isOpen,
  setAboutModalOpen,
  setAlertModalOpen,
  setWorklogModalOpen,
}: Props): Node => (
  <ModalDialog
    isOpen={isOpen}
    onClose={() => setAboutModalOpen(false)}
    onDialogDismissed={() => setAboutModalOpen(false)}
  >
    <Flex column alignCenter style={{ margin: '20px 0px' }}>
      <Button
        style={{ marginBottom: 18, width: 400 }}
        onClick={() => ipcRenderer.send('showIdlePopup')}
      >
        Display Idle Popup
      </Button>
      <Button
        style={{ marginBottom: 18, width: 400 }}
        onClick={() => ipcRenderer.send('showScreenPreviewPopup')}
      >
        Display ScreenshotPopup Popup
      </Button>
      <Button
        style={{ marginBottom: 18, width: 400 }}
        onClick={() => setAlertModalOpen(true)}
      >
        Display Alert Modal
      </Button>
      <Button
        style={{ width: 400 }}
        onClick={() => setWorklogModalOpen(true)}
      >
        Display Worklog Modal
      </Button>
    </Flex>
  </ModalDialog>
);

function mapStateToProps(state) {
  return {
    isOpen: getAboutModalOpen(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(uiActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutModal);
