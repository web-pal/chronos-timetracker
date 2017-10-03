// @flow
// TODO: delete state from this component
import React, { Component } from 'react';
import ModalDialog from '@atlaskit/modal-dialog';
import ButtonGroup from '@atlaskit/button-group';
import Button from '@atlaskit/button';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { remote } from 'electron';

import { H700 } from 'styles/typography';
import { ModalContentContainer } from 'styles/modals';
import { uiActions, settingsActions } from 'actions';
import { Flex } from 'components';
import { getSettingsModalTab, getSettingsModalOpen, getLocalDesktopSettings } from 'selectors';


import GeneralSettings from './GeneralSettings';
import NotificationSettings from './NotificationSettings';

import type { Settings,
  SetSettingsModalOpen,
  SetSettingsModalTab,
  RequestLocalDesktopSettings,
  SetLocalDesktopSetting
} from '../../../types';

import {
  Separator,
  SettingsSectionLabel,
} from './styled';

const sharedObj = remote.getGlobal('sharedObj');

type Props = {
  isOpen: boolean,
  tab: string,
  settings: Settings,
  setSettingsModalOpen: SetSettingsModalOpen,
  setSettingsModalTab: SetSettingsModalTab,
  requestLocalDesktopSettings: RequestLocalDesktopSettings,
  setLocalDesktopSetting: SetLocalDesktopSetting,
}

class SettingsModal extends Component<Props> {
  componentDidMount() {
    this.props.requestLocalDesktopSettings();
  }

  onClose = () => this.props.setSettingsModalOpen(false);

  setTab = value => this.props.setSettingsModalTab(value);

  setTraySettings = value => {
    sharedObj.trayShowTimer = value;
    this.props.setLocalDesktopSetting(value, 'trayShowTimer');
  }

  render() {
    const { isOpen, tab, settings, setLocalDesktopSetting } = this.props;

    console.log(isOpen);

    return (
      <ModalDialog
        isOpen={isOpen}
        onClose={this.onClose}
        onDialogDismissed={this.onClose}
        footer={
          <Flex row style={{ justifyContent: 'flex-end' }}>
            <ButtonGroup>
              <Button
                appearance="default"
                onClick={this.onClose}
              >
                Close
              </Button>
            </ButtonGroup>
          </Flex>
        }
      >
        <ModalContentContainer>
          <H700 style={{ marginBottom: 28, display: 'block' }}>Settings</H700>
          <Flex row style={{ height: 250 }}>
            <Flex column style={{ width: 85 }}>
              <SettingsSectionLabel
                active={tab === 'General'}
                onClick={() => this.setTab('General')}
              >
                General
              </SettingsSectionLabel>
              <SettingsSectionLabel
                active={tab === 'Notifications'}
                onClick={() => this.setTab('Notifications')}
              >
                Notifications
              </SettingsSectionLabel>
            </Flex>
            <Separator />
            {tab === 'General' &&
              <GeneralSettings
                settings={settings}
                setTraySettings={this.setTraySettings}
              />
            }
            {tab === 'Notifications' &&
              <NotificationSettings
                settings={settings}
                setLocalDesktopSetting={setLocalDesktopSetting}
              />
            }
          </Flex>
        </ModalContentContainer>
      </ModalDialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    isOpen: getSettingsModalOpen(state),
    settings: getLocalDesktopSettings(state),
    tab: getSettingsModalTab(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...uiActions, ...settingsActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsModal);
