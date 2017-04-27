import React, { PropTypes } from 'react';

import Flex from '../../../Base/Flex/Flex';

const Form = ({ settings, onScreenshotTimeChange, onLocaDesktopSettingsChange }) =>
  <Flex column className="Settings-section__form">
    <div className="form-group">
      <input
        name="showScreenshotPreview"
        id="showPreview"
        type="checkbox"
        checked={settings.get('showScreenshotPreview')}
        onChange={
          ev => onLocaDesktopSettingsChange('showScreenshotPreview', ev.target.checked)
        }
      />
      <label htmlFor="showPreview">Screenshot preview</label>
    </div>
    {settings.get('showScreenshotPreview') &&
      <div>
        <div className="subInputs">
          <div className="form-group">
            <input
              name="previewTime"
              id="5s"
              type="radio"
              checked={settings.get('screenshotPreviewTime') === 5}
              onChange={onScreenshotTimeChange(5)}
            />
            <label htmlFor="5s">5 seconds </label>
          </div>
          <div className="form-group">
            <input
              name="previewTime"
              id="10s"
              type="radio"
              checked={settings.get('screenshotPreviewTime') === 10}
              onChange={onScreenshotTimeChange(10)}
            />
            <label htmlFor="10s">10 seconds</label>
          </div>
          <div className="form-group">
            <input
              name="previewTime"
              id="15s"
              type="radio"
              checked={settings.get('screenshotPreviewTime') === 15}
              onChange={onScreenshotTimeChange(15)}
            />
            <label htmlFor="15s">15 seconds</label>
          </div>
        </div>
      </div>
    }
  </Flex>

Form.propTypes = {
  settings: PropTypes.object.isRequired,
  onScreenshotTimeChange: PropTypes.func.isRequired,
  onLocaDesktopSettingsChange: PropTypes.func.isRequired,
};

export default Form;
