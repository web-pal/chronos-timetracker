// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import { AkFieldRadioGroup as RadioButtonGroup } from '@atlaskit/field-radio-group';
import { CheckboxStateless as Checkbox } from '@atlaskit/checkbox';
import { H100 } from 'styles/typography';
import { Flex } from 'components';

import { SettingsSectionContent, ContentLabel } from './styled';
import type { LocalDesktopSettings, SetLocalDesktopSetting } from '../../../types';

type Props = {
  settings: LocalDesktopSettings,
  setLocalDesktopSetting: SetLocalDesktopSetting,
}

const NotificationsSettings: StatelessFunctionalComponent<Props> = ({
  settings,
  setLocalDesktopSetting,
}: Props): Node => {
  const notificationsTypes = [
    {
      name: 'nativeNotifications',
      value: 1,
      label: 'Use native notifications',
      isSelected: settings.nativeNotifications,
    },
    {
      name: 'nativeNotifications',
      value: 0,
      label: 'Use popup notifications',
      isSelected: !settings.nativeNotifications,
    },
  ];

  const screenshotPreviewDuration = [
    {
      name: 'previewTime',
      value: 5,
      label: 'Show notifications for 5 seconds',
      isSelected: settings.screenshotPreviewTime === 5,
    },
    {
      name: 'previewTime',
      value: 10,
      label: 'Show notifications for 10 seconds',
      isSelected: settings.screenshotPreviewTime === 10,
    },
    {
      name: 'previewTime',
      value: 15,
      label: 'Show notifications for 15 seconds',
      isSelected: settings.screenshotPreviewTime === 15,
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
          isChecked={settings.showScreenshotPreview}
          label="Enable screen preview notifications"
          onChange={
            () => setLocalDesktopSetting(!settings.showScreenshotPreview, 'showScreenshotPreview')
          }
        />

        {process.platform === 'darwin' &&
          <Flex column>
            {settings.showScreenshotPreview &&
              <H100 style={{ margin: '10px 0 0 6px' }}>
                Configure whether to show native OSX notification or custom popup.
                Native popups are visible in fullscreen apps.
              </H100>
            }
            {settings.showScreenshotPreview &&
              <div style={{ marginLeft: -8, marginTop: -20 }}>
                <RadioButtonGroup
                  items={notificationsTypes}
                  onRadioChange={() => setLocalDesktopSetting(
                    !settings.nativeNotifications,
                    'nativeNotifications',
                  )}
                />
              </div>
            }
          </Flex>
        }

        {settings.showScreenshotPreview &&
          <H100 style={{ margin: '10px 0 0 6px' }}>
            Configure the time until screenshots accept automatically.
          </H100>
        }
        {settings.showScreenshotPreview &&
          <div style={{ marginLeft: -8, marginTop: -20 }}>
            <RadioButtonGroup
              items={screenshotPreviewDuration}
              onRadioChange={(ev) =>
                setLocalDesktopSetting(Number(ev.target.value), 'screenshotPreviewTime')
              }
            />
          </div>
        }

      </Flex>
    </SettingsSectionContent>
  );
};

export default NotificationsSettings;
