import React from 'react';
import { AkFieldRadioGroup as RadioButtonGroup } from '@atlaskit/field-radio-group';
import { CheckboxStateless as Checkbox } from '@atlaskit/checkbox';

import { SettingsSectionContent, ContentLabel } from './styled';
import Flex from '../../../components/Base/Flex/Flex';
import { H100 } from '../../../styles/typography';

const NotificationsSettings = ({
/* eslint-disable */
  settings,
  setLocalDesktopSettings,
/* eslint-enable */
}) => {
  console.log('rerender');
  console.log(settings.toJS());
  const notificationsTypes = [
    {
      name: 'nativeNotifications',
      value: 1,
      label: 'Use native notifications',
      isSelected: settings.get('nativeNotifications'),
    },
    {
      name: 'nativeNotifications',
      value: 0,
      label: 'Use popup notifications',
      isSelected: !settings.get('nativeNotifications'),
    },
  ];

  const screenshotPreviewDuration = [
    {
      name: 'previewTime',
      value: 5,
      label: 'Show notifications for 5 seconds',
      isSelected: settings.get('screenshotPreviewTime') === 5,
    },
    {
      name: 'previewTime',
      value: 10,
      label: 'Show notifications for 10 seconds',
      isSelected: settings.get('screenshotPreviewTime') === 10,
    },
    {
      name: 'previewTime',
      value: 15,
      label: 'Show notifications for 15 seconds',
      isSelected: settings.get('screenshotPreviewTime') === 15,
    },
  ];

  return (
    <SettingsSectionContent>
      <ContentLabel>
        Notifications
      </ContentLabel>
      <Flex column>
        <H100 style={{ margin: '0 0 4px 6px' }}>
          Configure whether to show screenshot popup or not.
        </H100>
        <Checkbox
          name="showScreenshotPreview"
          id="showPreview"
          isChecked={settings.get('showScreenshotPreview')}
          label="Enable screen preview notifications"
          onChange={
            () => setLocalDesktopSettings('showScreenshotPreview', !settings.get('showScreenshotPreview'))
          }
        />

        <H100 style={{ margin: '10px 0 0 6px' }}>
          Configure whether to show native OSX notification or custom popup.
          Native popups are visible in fullscreen apps.
        </H100>
        {settings.get('showScreenshotPreview') &&
          <div style={{ marginLeft: -8 }}>
            <RadioButtonGroup
              items={notificationsTypes}
              onRadioChange={() => setLocalDesktopSettings(
                'nativeNotifications',
                !settings.get('nativeNotifications'),
              )}
            />
          </div>
        }

        <H100 style={{ margin: '10px 0 0 6px' }}>
          Configure the time until screenshots accept automatically.
        </H100>
        {settings.get('showScreenshotPreview') &&
          <div style={{ marginLeft: -8 }}>
            <RadioButtonGroup
              items={screenshotPreviewDuration}
              onRadioChange={(ev) =>
                setLocalDesktopSettings('screenshotPreviewTime', +ev.target.value)
              }
            />
          </div>
        }

      </Flex>
    </SettingsSectionContent>
  );
};

NotificationsSettings.propTypes = {

};

export default NotificationsSettings;
