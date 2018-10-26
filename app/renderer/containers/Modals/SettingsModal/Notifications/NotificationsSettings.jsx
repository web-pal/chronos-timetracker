// @flow
import React from 'react';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';
import type {
  SettingsGeneral,
} from 'types';

import {
  AkFieldRadioGroup as RadioButtonGroup,
} from '@atlaskit/field-radio-group';
import {
  Checkbox,
} from '@atlaskit/checkbox';
import {
  Flex,
} from 'components';
import {
  H100,
} from 'styles/typography';

import {
  SettingsSectionContent,
  ContentLabel,
} from './styled';


type Props = {
  settings: SettingsGeneral,
  onChangeSetting: (value: any, settingName: string) => void,
}

const NotificationsSettings: StatelessFunctionalComponent<Props> = ({
  settings,
  onChangeSetting,
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
          onChange={() => {
            onChangeSetting(
              !settings.showScreenshotPreview,
              'showScreenshotPreview',
            );
          }}
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
              <div style={{ marginLeft: -8 }}>
                <RadioButtonGroup
                  items={notificationsTypes}
                  onRadioChange={() => {
                    onChangeSetting(
                      !settings.nativeNotifications,
                      'nativeNotifications',
                    );
                  }}
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
          <div style={{ marginLeft: -8 }}>
            <RadioButtonGroup
              items={screenshotPreviewDuration}
              onRadioChange={(ev) => {
                onChangeSetting(
                  Number(ev.target.value),
                  'screenshotPreviewTime',
                );
              }}
            />
          </div>
        }

      </Flex>
    </SettingsSectionContent>
  );
};

export default NotificationsSettings;
