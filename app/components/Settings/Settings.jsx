import React, { PropTypes } from 'react';

import Flex from '../Base/Flex/Flex';
import SettingsHeader from './SettingsHeader/SettingsHeader';
import SettingsBody from './SettingsBody/SettingsBody';

const Settings = (props) =>
  <Flex row centered className="Settings">
    <span className="fa fa-times Settings__close-btn" onClick={props.onClose} />
    <Flex column className="Settings__inner-wrapper">
      <SettingsHeader />
      <SettingsBody {...props} />
    </Flex>
  </Flex>;

Settings.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Settings;
