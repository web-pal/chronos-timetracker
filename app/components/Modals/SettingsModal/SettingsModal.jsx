import React from 'react';
import ModalDialog from '@atlaskit/modal-dialog';
import { DropdownItemCheckbox } from '@atlaskit/dropdown-menu';

import Flex from '../../../components/Base/Flex/Flex';
import {
  SettingsLabel,
  SettingsSectionContent,
  Separator,
  SettingsSectionLabel,
  ContentLabel,
} from './styled';

// eslint-disable-next-line
export default ({ isOpen, onClose }) => (
  <ModalDialog
    onDialogDismissed={onClose}
    isOpen={isOpen}
  >
    <SettingsLabel>Settings</SettingsLabel>
    <Flex row style={{ padding: '0px 4px' }}>
      <Flex column>
        <SettingsSectionLabel active>
          General
        </SettingsSectionLabel>
        <SettingsSectionLabel>
          Appearence
        </SettingsSectionLabel>
        <SettingsSectionLabel>
          Screenshots
        </SettingsSectionLabel>
      </Flex>
      <Separator />
      <SettingsSectionContent>
        <ContentLabel>
          General
        </ContentLabel>
        <DropdownItemCheckbox>
          Show timer
        </DropdownItemCheckbox>
        <DropdownItemCheckbox>
          Show time in 24-hour format
        </DropdownItemCheckbox>
        <DropdownItemCheckbox>
          Hide screenshot previews
        </DropdownItemCheckbox>
        <DropdownItemCheckbox>
          Log activity data
        </DropdownItemCheckbox>
        <DropdownItemCheckbox>
          Hide tray icon
        </DropdownItemCheckbox>
        <DropdownItemCheckbox>
          Correct spelling automatically
        </DropdownItemCheckbox>
      </SettingsSectionContent>
    </Flex>
  </ModalDialog>
);
