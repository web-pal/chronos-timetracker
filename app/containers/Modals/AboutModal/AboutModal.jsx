// CAUTION! not migrated to 3.*.* version
// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import ModalDialog from '@atlaskit/modal-dialog';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import { bindActionCreators } from 'redux';
import { Flex } from 'components';
import { Button } from 'styles/buttons';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { uiActions } from 'actions';
import { getAboutModalOpen } from 'selectors';

import type {
  SetAboutModalOpen,
  SetAlertModalOpen,
  SetWorklogModalOpen,
  AddFlag,
} from '../../../types';

type Props = {
  isOpen: boolean,
  setAboutModalOpen: SetAboutModalOpen,
  setAlertModalOpen: SetAlertModalOpen,
  setWorklogModalOpen: SetWorklogModalOpen,
  addFlag: AddFlag,
};

const AboutModal: StatelessFunctionalComponent<Props> = ({
  isOpen,
  setAboutModalOpen,
  setAlertModalOpen,
  setWorklogModalOpen,
  addFlag,
}: Props): Node => isOpen && (
  <ModalDialog onClose={() => setAboutModalOpen(false)}>
    <Flex column alignCenter style={{ margin: '20px 0px' }}>
      <Button
        style={{ marginBottom: 18, width: 400 }}
        onClick={() => ipcRenderer.send('show-idle-popup')}
      >
        Display Idle Popup
      </Button>
      <Button
        style={{ marginBottom: 18, width: 400 }}
        onClick={() => ipcRenderer.send('show-screenshot-popup')}
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
        style={{ marginBottom: 18, width: 400 }}
        onClick={() => setWorklogModalOpen(true)}
      >
        Display Worklog Modal
      </Button>
      <Button
        style={{ width: 400 }}
        onClick={() => addFlag({
          title: 'Error',
          appearance: 'normal',
          description: 'error appeared kek lol',
          icon: (
            <ErrorIcon label="error" size="medium" primaryColor="#ff5631" />
          ),
        })}
      >
        Display Error Flag
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
