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

import Modal, {
  ModalTransition,
} from '@atlaskit/modal-dialog';

import {
  uiActions,
  settingsActions,
  updaterActions,
  usersActions,
} from 'actions';

import {
  Flex,
} from 'components';
import {
  getUiState,
  getModalState,
} from 'selectors';


import GeneralSettings from './General';
import ScreenshotsSettings from './ScreenshotsSettings';
import TeamStatusSettings from './TeamStatus';
import UpdateSettings from './Update';

import * as S from './styled';


type Props = {
  isOpen: boolean,
  tab: string,
  settings: SettingsGeneral,
  updateCheckRunning: boolean,
  updateAvailable: string,
  downloadUpdateProgress: any,
  isUsersFetching: boolean,
  dispatch: Dispatch,
}

const SettingsModal: StatelessFunctionalComponent<Props> = ({
  isOpen,
  tab,
  settings,
  updateAvailable,
  downloadUpdateProgress,
  updateCheckRunning,
  isUsersFetching,
  dispatch,
}: Props): Node => (
  <ModalTransition>
    {isOpen && (
    <Modal
      heading="Settings"
      actions={[
        {
          text: 'Close',
          onClick: () => {
            dispatch(uiActions.setModalState('settings', false));
          },
        },
      ]}
    >
      <Flex row style={{ height: 400 }}>
        <Flex column style={{ width: 85 }}>
          <S.SettingsSectionLabel
            active={tab === 'General'}
            onClick={() => {
              dispatch(uiActions.setUiState({
                settingsTab: 'General',
              }));
            }}
          >
            General
          </S.SettingsSectionLabel>
          <S.SettingsSectionLabel
            active={tab === 'Screenshots'}
            onClick={() => {
              dispatch(uiActions.setUiState({
                settingsTab: 'Screenshots',
              }));
            }}
          >
            Screenshots
          </S.SettingsSectionLabel>
          <S.SettingsSectionLabel
            active={tab === 'Team'}
            onClick={() => {
              dispatch(uiActions.setUiState({
                settingsTab: 'Team',
              }));
            }}
          >
            Team
          </S.SettingsSectionLabel>
          <S.SettingsSectionLabel
            active={tab === 'Updates'}
            onClick={() => {
              dispatch(uiActions.setUiState({
                settingsTab: 'Updates',
              }));
            }}
          >
            Updates
          </S.SettingsSectionLabel>
        </Flex>
        <S.Separator />
        {tab === 'General' && (
          <GeneralSettings
            settings={settings}
            setTraySettings={(value) => {
              dispatch(uiActions.setUiState({
                trayShowTimer: value,
              }));
            }}
            clearChache={() => dispatch(
              settingsActions.clearElectronCache(),
            )}
            setAllowEmptyComment={(value) => {
              dispatch(uiActions.setUiState({
                allowEmptyComment: value,
              }));
            }}
            setShowLoggedOnStop={(value) => {
              dispatch(uiActions.setUiState({
                showLoggedOnStop: value,
              }));
            }}
          />
        )}
        {tab === 'Screenshots' && (
          <ScreenshotsSettings />
        )}
        {tab === 'Team' && (
          <TeamStatusSettings
            isUsersFetching={isUsersFetching}
            saveUsers={userIds => dispatch(usersActions.fetchUsersRequest({ userIds }))}
          />
        )}
        {tab === 'Updates' && (
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
              dispatch(uiActions.setUiState({
                updateChannel: value,
              }));
            }}
            automaticUpdate={settings.updateAutomatically}
            setAutomaticUpdate={(value) => {
              dispatch(updaterActions.setUpdateSettings({
                autoDownload: value,
                allowPrerelease: settings.updateChannel !== 'stable',
              }));
              dispatch(uiActions.setUiState({
                updateAutomatically: value,
              }));
            }}
            updateAvailable={updateAvailable}
            downloadUpdateProgress={downloadUpdateProgress}
            onUpdateClick={() => {
              dispatch(updaterActions.downloadUpdate());
            }}
          />
        )}
      </Flex>
    </Modal>
    )}
  </ModalTransition>
);

function mapStateToProps(state) {
  const updateAvailable = getUiState('updateAvailable')(state);
  return {
    isOpen: getModalState('settings')(state),
    settings: getUiState([
      'trayShowTimer',
      'allowEmptyComment',
      'showLoggedOnStop',
      'updateChannel',
      'updateAutomatically',
    ])(state),
    tab: getUiState('settingsTab')(state),
    isUsersFetching: getUiState('isUsersFetching')(state),
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
