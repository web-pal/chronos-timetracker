import React from 'react';
import { DropdownItemCheckbox } from '@atlaskit/dropdown-menu';

import { SettingsSectionContent, ContentLabel } from './styled';
import Flex from '../../../components/Base/Flex/Flex';

const NotificationsSettings = () => (
  <SettingsSectionContent>
    <ContentLabel>
      Notifications
    </ContentLabel>
    <Flex column>
      <DropdownItemCheckbox>
        Enable noitifications
      </DropdownItemCheckbox>
      <DropdownItemCheckbox>
        Show popup noitifications for 15 minutes
      </DropdownItemCheckbox>
      <DropdownItemCheckbox>
        Use native notifications
      </DropdownItemCheckbox>
      <DropdownItemCheckbox>
        Use popup notifications
      </DropdownItemCheckbox>
    </Flex>
  </SettingsSectionContent>
);

NotificationsSettings.propTypes = {

};

export default NotificationsSettings;
