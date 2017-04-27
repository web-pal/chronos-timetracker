import React, { PropTypes } from 'react';

import Flex from '../../Base/Flex/Flex';

const SettingsHeader = ({ label }) =>
  <Flex row centered className="Settings__header">
    <h2>{label}</h2>
  </Flex>;

SettingsHeader.propTypes = {
  label: PropTypes.string,
};

SettingsHeader.defaultProps = {
  label: 'Preferences',
};

export default SettingsHeader;
