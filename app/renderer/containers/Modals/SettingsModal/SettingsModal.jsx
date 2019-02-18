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
  SettingsGeneral,
} from 'types';

import ModalDialog, {
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@atlaskit/modal-dialog';
import Button from '@atlaskit/button';

import {
  ModalContentContainer,
} from 'styles/modals';
import {
  uiActions,
  settingsActions,
  updaterActions,
} from 'actions';

import {
  Flex,
} from 'components';
import {
  getUiState,
  getSettingsState,
  getModalState,
} from 'selectors';


import GeneralSettings from './General';
import NotificationSettings from './Notifications';
import UpdateSettings from './Update';

import {
  Separator,
  SettingsSectionLabel,
} from './styled';


type Props = {
  isOpen: boolean,
  tab: string,
  settings: SettingsGeneral,
  updateCheckRunning: boolean,
  updateAvailable: string,
  downloadUpdateProgress: any,
  dispatch: Dispatch,
}

const SettingsModal: StatelessFunctionalComponent<Props> = ({
  isOpen,
  tab,
  settings,
  updateAvailable,
  downloadUpdateProgress,
  updateCheckRunning,
  dispatch,
}: Props): Node => isOpen && (
  <ModalDialog
    header={() => (
      <ModalHeader>
        <ModalTitle>Settings</ModalTitle>
      </ModalHeader>
    )}
    footer={() => (
      <ModalFooter>
        <Flex row style={{ justifyContent: 'flex-end', width: '100%' }}>
          <Button
            appearance="default"
            onClick={() => {
              dispatch(uiActions.setModalState('settings', false));
            }}
          >
            Close
          </Button>
        </Flex>
      </ModalFooter>
    )}
    onClose={() => {
      dispatch(uiActions.setModalState('settings', false));
    }}
  >
    <ModalContentContainer>
      <Flex row style={{ height: 324 }}>
        <Flex column style={{ width: 85 }}>
          <SettingsSectionLabel
            active={tab === 'General'}
            onClick={() => {
              dispatch(settingsActions.setSettingsModalTab('General'));
            }}
          >
            General
          </SettingsSectionLabel>
          {/*
          <SettingsSectionLabel
            active={tab === 'Notifications'}
            onClick={() => {
              dispatch(settingsActions.setSettingsModalTab('Notifications'));
            }}
          >
            Notifications
          </SettingsSectionLabel>
          */}
          <SettingsSectionLabel
            active={tab === 'Updates'}
            onClick={() => {
              dispatch(settingsActions.setSettingsModalTab('Updates'));
            }}
          >
            Updates
          </SettingsSectionLabel>
        </Flex>
        <Separator />
        {tab === 'General' &&
          <GeneralSettings
            settings={settings}
            setTraySettings={(value) => {
              dispatch(settingsActions.setLocalDesktopSetting(
                value,
                'trayShowTimer',
              ));
            }}
            clearChache={() => dispatch(
              settingsActions.clearElectronCache(),
            )}
            setAllowEmptyComment={(value) => {
              dispatch(settingsActions.setLocalDesktopSetting(
                value,
                'allowEmptyComment',
              ));
              }
            }
            setShowLoggedOnStop={(value) => {
              dispatch(settingsActions.setLocalDesktopSetting(
                value,
                'showLoggedOnStop',
              ));
              }
            }
          />
        }
        {tab === 'Notifications' &&
          <NotificationSettings
            settings={settings}
            onChangeSetting={(value, settingName) => {
              dispatch(settingsActions.setLocalDesktopSetting(
                value,
                settingName,
              ));
            }}
          />
        }
        {tab === 'Updates' &&
          <UpdateSettings
            channel={settings.updateChannel}
            updateCheckRunning={updateCheckRunning}
            checkForUpdates={() => {
              dispatch(uiActions.setUiState({
                updateAvailable: null,
              }));
              dispatch(updaterActions.checkUpdates());
            }}
            setChannel={(value) => {
              dispatch(updaterActions.setUpdateSettings({
                autoDownload: settings.updateAutomatically,
                allowPrerelease: value !== 'stable',
              }));
              dispatch(settingsActions.setLocalDesktopSetting(
                value,
                'updateChannel',
              ));
            }}
            automaticUpdate={settings.updateAutomatically}
            setAutomaticUpdate={(value) => {
              dispatch(updaterActions.setUpdateSettings({
                autoDownload: value,
                allowPrerelease: settings.updateChannel !== 'stable',
              }));
              dispatch(settingsActions.setLocalDesktopSetting(
                value,
                'updateAutomatically',
              ));
            }}
            updateAvailable={updateAvailable}
            downloadUpdateProgress={downloadUpdateProgress}
            onUpdateClick={() => {
              dispatch(updaterActions.downloadUpdate());
            }}
          />
        }
      </Flex>
    </ModalContentContainer>
  </ModalDialog>
);

function mapStateToProps(state) {
  const updateAvailable = getUiState('updateAvailable')(state);
  return {
    isOpen: getModalState('settings')(state),
    settings: getSettingsState('localDesktopSettings')(state),
    tab: getSettingsState('modalTab')(state),
    updateAvailable,
    updateCheckRunning: updateAvailable === null,
    downloadUpdateProgress: getUiState('downloadUpdateProgress')(state),
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(SettingsModal);
