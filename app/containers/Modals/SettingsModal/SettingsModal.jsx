// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import ModalDialog, { ModalFooter, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';
import Button, { ButtonGroup } from '@atlaskit/button';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ModalContentContainer } from 'styles/modals';
import { uiActions, settingsActions } from 'actions';
import { Flex } from 'components';
import { getSettingsModalTab, getSettingsModalOpen, getLocalDesktopSettings } from 'selectors';


import GeneralSettings from './GeneralSettings';
import NotificationSettings from './NotificationSettings';

import type { Settings,
  SetSettingsModalOpen,
  SetSettingsModalTab,
  SetLocalDesktopSetting,
} from '../../../types';

import {
  Separator,
  SettingsSectionLabel,
} from './styled';

type Props = {
  isOpen: boolean,
  tab: string,
  settings: Settings,
  setSettingsModalOpen: SetSettingsModalOpen,
  setSettingsModalTab: SetSettingsModalTab,
  setLocalDesktopSetting: SetLocalDesktopSetting,
}

const SettingsModal: StatelessFunctionalComponent<Props> = ({
  isOpen,
  tab,
  settings,
  setSettingsModalOpen,
  setSettingsModalTab,
  setLocalDesktopSetting,
}: Props): Node => isOpen &&
  <ModalDialog
    onClose={() => setSettingsModalOpen(false)}
    footer={() => (
      <ModalFooter>
        <Flex row style={{ justifyContent: 'flex-end', width: '100%' }}>
          <Button
            appearance="default"
            onClick={() => setSettingsModalOpen(false)}
          >
            Close
          </Button>
        </Flex>
      </ModalFooter>
    )}
    header={() => (
      <ModalHeader>
        <ModalTitle>Settings</ModalTitle>
      </ModalHeader>
    )}
  >
    <ModalContentContainer>
      <Flex row style={{ height: 250 }}>
        <Flex column style={{ width: 85 }}>
          <SettingsSectionLabel
            active={tab === 'General'}
            onClick={() => setSettingsModalTab('General')}
          >
            General
          </SettingsSectionLabel>
          <SettingsSectionLabel
            active={tab === 'Notifications'}
            onClick={() => setSettingsModalTab('Notifications')}
          >
            Notifications
          </SettingsSectionLabel>
        </Flex>
        <Separator />
        {tab === 'General' &&
          <GeneralSettings
            settings={settings}
            setTraySettings={(value) => setLocalDesktopSetting(value, 'trayShowTimer')}
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
  </ModalDialog>;

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
