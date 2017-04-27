import React from 'react';

import SettingsSection from '../../SettingsSection/SettingsSection';
import Form from './Form';
import Description from './Description';

const NotificationsSection = props =>
  <SettingsSection name="notifications">
    <Form {...props} />
    <Description />
  </SettingsSection>;

export default NotificationsSection;
