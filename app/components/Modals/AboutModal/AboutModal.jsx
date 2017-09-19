import React from 'react';
import ModalDialog from '@atlaskit/modal-dialog';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import { bindActionCreators } from 'redux';

import * as uiActions from '../../../actions/ui';

import Flex from '../../../components/Base/Flex/Flex';
import {} from './styled';
// import {
//   H100, H200, H300, H400, H500, H600, H700, H800,
//   Link,
// } from '../../../styles/typography';
import { Button } from '../../../styles/buttons';

import SettingsModal from '../../../containers/SettingsModal/SettingsModal';

// eslint-disable-next-line
const AboutModal = ({ isOpen, setShowAboutModal, ...props }) => (
  <ModalDialog
    onDialogDismissed={() => setShowAboutModal(false)}
    isOpen={isOpen}
  >
    <Flex column alignCenter style={{ margin: '20px 0px' }}>
      <SettingsModal />
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
        style={{ width: 400 }}
        onClick={() => props.setShowAlertModal(true)}
      >
        Display Alert Modal
      </Button>
    </Flex>
    {/*
    <Flex column>
      <H800>Welcome to the Research Operations monthly!</H800>
      <H700>Welcome to the Research Operations monthly!</H700>
      <H600>Welcome to the Research Operations monthly!</H600>
      <H500>Welcome to the Research Operations monthly!</H500>
      <H400>Welcome to the Research Operations monthly!</H400>
      <H300>Welcome to the Research Operations monthly!</H300>
      <H200>Welcome to the Research Operations monthly!</H200>
      <H100>Welcome to the Research Operations monthly!</H100>
      <Link>Welcome to the Research Operations monthly!</Link>
    </Flex>
    */}
  </ModalDialog>
);

function mapStateToProps({ ui }) {
  return {
    isOpen: ui.showAboutModal,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(uiActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutModal);
