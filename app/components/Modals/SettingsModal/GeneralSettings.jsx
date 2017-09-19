import React from 'react';
import { DropdownItemCheckbox } from '@atlaskit/dropdown-menu';

import Flex from '../../../components/Base/Flex/Flex';
import { SettingsSectionContent, ContentLabel } from './styled';

const GeneralSettings = () => (
  <SettingsSectionContent>
    <ContentLabel>
      General
    </ContentLabel>
    <Flex column>
      <DropdownItemCheckbox>
        Log activity data
      </DropdownItemCheckbox>
      <DropdownItemCheckbox>
        Hide tray icon
      </DropdownItemCheckbox>
      <DropdownItemCheckbox>
        Hide timer in tray
      </DropdownItemCheckbox>
    </Flex>
  </SettingsSectionContent>
);

GeneralSettings.propTypes = {

};

export default GeneralSettings;
