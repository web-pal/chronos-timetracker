import React, { PropTypes } from 'react';

import Flex from '../../../Base/Flex/Flex';

const Form = ({ settings, setTraySettings }) =>
  <Flex column className="Settings-section__form">
    <div className="form-group">
      <input
        name="trayShowTimer"
        id="showTimer"
        type="radio"
        checked={settings.get('trayShowTimer')}
        onChange={setTraySettings(true)}
      />
      <label htmlFor="showTimer">
        Show timer
      </label>
    </div>
    <div className="form-group">
      <input
        name="trayShowTimer"
        id="hideTimer"
        type="radio"
        checked={!settings.get('trayShowTimer')}
        onChange={setTraySettings(false)}
      />
      <label htmlFor="hideTimer">
        Hide timer
      </label>
    </div>
  </Flex>;

Form.propTypes = {
  settings: PropTypes.object.isRequired,
  setTraySettings: PropTypes.func.isRequired,
};

export default Form;
