import React from 'react';
import ModalDialog from '@atlaskit/modal-dialog';
import { DropdownItemCheckbox } from '@atlaskit/dropdown-menu';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as uiActions from '../../../actions/ui';

import Flex from '../../../components/Base/Flex/Flex';
import {
  SettingsLabel,
  SettingsSectionContent,
  Separator,
  SettingsSectionLabel,
  ContentLabel,
} from './styled';

// eslint-disable-next-line
const SettingsModal = ({ isOpen, setShowSettingsModal }) => (
  <ModalDialog
    onDialogDismissed={() => setShowSettingsModal(false)}
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

function mapStateToProps({ ui }) {
  return {
    isOpen: ui.showSettingsModal,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(uiActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsModal);
