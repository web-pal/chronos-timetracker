import React, { PropTypes } from 'react';

import Flex from '../../Base/Flex/Flex';

const SettingsSection = ({ name, children }) =>
  <Flex row className={`Settings-section ${name}`}>
    {children}
  </Flex>;

SettingsSection.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string,
};

SettingsSection.defaultProps = {
  name: 'unnamed',
  children: null,
};

export default SettingsSection;
