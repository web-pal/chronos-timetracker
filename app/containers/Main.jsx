import React from 'react';

import Flex from '../components/Base/Flex/Flex';
import Tracker from './Tracker/Tracker';
import Menu from './Menu/Menu';
import SettingsModal from './SettingsModal/SettingsModal';


const Main = () =>
  <Flex row className="occupy-height">
    <Menu />
    <Tracker />
    <SettingsModal />
  </Flex>;

export default Main;
