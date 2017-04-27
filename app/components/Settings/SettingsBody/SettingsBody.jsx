import React from 'react';

import Flex from '../../Base/Flex/Flex';
import { ScreenshotsSection, NotificationsSection } from '../Sections';

const SettingsBody = props =>
  <Flex column className="Settings__body">
    <ScreenshotsSection {...props} />
    <NotificationsSection {...props} />
  </Flex>;

export default SettingsBody;
