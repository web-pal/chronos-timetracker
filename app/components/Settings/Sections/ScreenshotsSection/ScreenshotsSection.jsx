import React, { PropTypes } from 'react';

import SettingsSection from '../../SettingsSection/SettingsSection';
import Form from './Form';
import Description from './Description';

const ScreenshotsSection = props =>
  <SettingsSection name="screenshots">
    <Form {...props} />
    <Description />
  </SettingsSection>;

ScreenshotsSection.propTypes = {

};

export default ScreenshotsSection;
