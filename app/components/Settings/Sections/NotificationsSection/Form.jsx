import React, { PropTypes } from 'react';

import Flex from '../../../Base/Flex/Flex';

const Form = ({ settings, onNativeNotificationSettingsChange }) =>
  <Flex column className="Settings-section__form">
    <div className="form-group">
      <input
        name="nativeNotifications"
        id="useNative"
        type="radio"
        checked={settings.get('nativeNotifications')}
        onChange={onNativeNotificationSettingsChange(true)}
      />
      <label htmlFor="useNative">
        Use native notifications
      </label>
    </div>
    <div className="form-group">
      <input
        name="nativeNotifications"
        id="usePopup"
        type="radio"
        checked={!settings.get('nativeNotifications')}
        onChange={onNativeNotificationSettingsChange(false)}
      />
      <label htmlFor="usePopup">
        Use popup notifications
      </label>
    </div>
  </Flex>;

Form.propTypes = {
  settings: PropTypes.object.isRequired,
  onNativeNotificationSettingsChange: PropTypes.func.isRequired,
};

export default Form;
