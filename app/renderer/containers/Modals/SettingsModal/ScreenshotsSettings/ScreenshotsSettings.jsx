// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';
import type {
  Connector,
} from 'react-redux';
import type {
  Dispatch,
} from 'types';

import {
  uiActions,
  screenshotsActions,
} from 'actions';
import {
  getUiState,
} from 'selectors';

import {
  Checkbox,
} from '@atlaskit/checkbox';
import Button, {
  ButtonGroup,
} from '@atlaskit/button';
import {
  AkFieldRadioGroup as RadioButtonGroup,
} from '@atlaskit/field-radio-group';

import {
  Flex,
} from 'components';
import {
  H100,
} from 'styles/typography';

import * as S from './styled';


type Props = {
  screenshotsEnabled: boolean,
  showScreenshotPreview: boolean,
  takeScreenshotLoading: boolean,
  useNativeNotifications: boolean,
  screenshotDecisionTime: number,
  dispatch: Dispatch,
}

const ScreenshotsSettings: StatelessFunctionalComponent<Props> = ({
  screenshotsEnabled,
  showScreenshotPreview,
  takeScreenshotLoading,
  useNativeNotifications,
  screenshotDecisionTime,
  dispatch,
}: Props): Node => {
  const notificationsTypes = [
    {
      name: 'nativeNotifications',
      value: 1,
      label: 'Use native notification',
      isSelected: useNativeNotifications,
    },
    {
      name: 'nativeNotifications',
      value: 0,
      label: 'Use popup notification',
      isSelected: !useNativeNotifications,
    },
  ];
  const screenshotPreviewDuration = [
    {
      name: 'previewTime',
      value: 5,
      label: '5 seconds',
      isSelected: screenshotDecisionTime === 5,
    },
    {
      name: 'previewTime',
      value: 10,
      label: '10 seconds',
      isSelected: screenshotDecisionTime === 10,
    },
    {
      name: 'previewTime',
      value: 15,
      label: '15 seconds',
      isSelected: screenshotDecisionTime === 15,
    },
  ];

  return (
    <S.SettingsSectionContent>
      <S.ContentLabel>
        Screenshots
      </S.ContentLabel>
      <Flex column>
        <H100 style={{ margin: '0 0 4px 6px' }}>
          One screenshot will be taken every 10 minutes during tracking time
        </H100>
        <Checkbox
          name="enableScreenshots"
          id="enableScreenshots"
          isChecked={screenshotsEnabled}
          label="Enable screenshots"
          onChange={() => {
            dispatch(uiActions.setUiState({
              screenshotsEnabled: !screenshotsEnabled,
            }));
          }}
        />
        {screenshotsEnabled
           && (
             <Flex column>
               <br />
               <Flex column>
                 <H100 style={{ margin: '0 0 4px 6px' }}>
                   Configure whether to show screenshot popup or not.
                 </H100>
                 <Checkbox
                   name="showScreenshotPreview"
                   id="showPreview"
                   isChecked={showScreenshotPreview}
                   label="Show screenshot preview popup"
                   onChange={() => {
                     dispatch(uiActions.setUiState({
                       showScreenshotPreview: !showScreenshotPreview,
                     }));
                   }}
                 />
                 {showScreenshotPreview && (
                   <div>
                     <RadioButtonGroup
                       label="Configure whether to show native notification or custom popup."
                       items={notificationsTypes}
                       onRadioChange={() => {
                         dispatch(uiActions.setUiState({
                           useNativeNotifications: !useNativeNotifications,
                         }));
                       }}
                     />
                     <RadioButtonGroup
                       label="Show screenshot preview popup for:"
                       items={screenshotPreviewDuration}
                       onRadioChange={(ev) => {
                         dispatch(uiActions.setUiState({
                           screenshotDecisionTime: Number(ev.target.value),
                         }));
                       }}
                     />
                   </div>
                 )}
               </Flex>
               <ButtonGroup>
                 <Button
                   isLoading={takeScreenshotLoading}
                   appearance="warning"
                   onClick={() => {
                     dispatch(screenshotsActions.takeScreenshotRequest({
                       isTest: true,
                       timestamp: new Date().getTime(),
                     }));
                   }}
                 >
                   Take test screenshot
                 </Button>
               </ButtonGroup>
             </Flex>
           )
        }
      </Flex>
    </S.SettingsSectionContent>
  );
};

function mapStateToProps(state) {
  return {
    screenshotsEnabled: getUiState('screenshotsEnabled')(state),
    useNativeNotifications: getUiState('useNativeNotifications')(state),
    showScreenshotPreview: getUiState('showScreenshotPreview')(state),
    takeScreenshotLoading: getUiState('takeScreenshotLoading')(state),
    screenshotDecisionTime: getUiState('screenshotDecisionTime')(state),
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(ScreenshotsSettings);
