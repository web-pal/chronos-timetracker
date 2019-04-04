// @flow
import React from 'react';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

import {
  Checkbox,
} from '@atlaskit/checkbox';
import Button, {
  ButtonGroup,
} from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';
import {
  Line,
} from 'rc-progress';

import {
  Flex,
} from 'components';
import {
  H100,
} from 'styles/typography';

import {
  openURLInBrowser,
} from 'utils/external-open-util';

import * as S from './styled';

import {
  version,
} from '../../../../../package.json';

type Props = {
  channel: string,
  updateCheckRunning: boolean,
  updateAvailable: string,
  downloadUpdateProgress: any,
  automaticUpdate: boolean,
  setAutomaticUpdate: (automaticUpdate: boolean) => void,
  setChannel: (channel: string) => void,
  checkForUpdates: () => void,
  onUpdateClick: () => void,
};

const UpdateSettings: StatelessFunctionalComponent<Props> = ({
  channel,
  setAutomaticUpdate,
  setChannel,
  updateCheckRunning,
  updateAvailable,
  downloadUpdateProgress,
  automaticUpdate,
  checkForUpdates,
  onUpdateClick,
} : Props): Node => (
  <S.SettingsSectionContent style={{ width: '100%' }}>
    <S.ContentLabel>
      Updates
    </S.ContentLabel>
    <Flex column style={{ marginLeft: 6 }}>
      <Flex column style={{ marginBottom: 10 }}>
        <H100 style={{ padding: '6px 0 10px 0' }}>
          {updateAvailable
            ? `New version (${updateAvailable}) is available.`
            : `You have latest version (${version}).`
          }
        </H100>
        {downloadUpdateProgress
          && (
          <Line
            percent={downloadUpdateProgress}
            strokeWidth="4"
            strokeColor="#D3D3D3"
            style={{
              marginBottom: '10px',
            }}
          />
          )
        }
        <ButtonGroup>
          {updateAvailable
            ? (
              <Flex row>
                <div>
                  <Button
                    appearance="primary"
                    onClick={() => {
                      if (!downloadUpdateProgress) {
                        onUpdateClick();
                      }
                    }}
                    iconAfter={
                    downloadUpdateProgress
                      && <Spinner invertColor />
                    }
                  >
                    {downloadUpdateProgress
                      ? 'Updating'
                      : 'Update now'
                    }
                  </Button>
                </div>
                <Flex row alignCenter style={{ marginLeft: 12 }}>
                  <span> or </span>
                  <Button
                    appearance="link"
                    spacing="compact"
                    onClick={() => {
                      openURLInBrowser(
                        'https://github.com/web-pal/Chronos/releases',
                      );
                    }}
                  >
                    download latest release manually
                  </Button>
                </Flex>
              </Flex>
            )
            : (
              <div>
                <Button
                  isDisabled={updateCheckRunning}
                  onClick={() => {
                    checkForUpdates();
                  }}
                  iconAfter={updateCheckRunning ? <Spinner /> : false}
                >
                  {updateCheckRunning
                    ? 'Checking for updates'
                    : 'Check for updates'
                  }
                </Button>
                {updateAvailable === false && (
                  <H100 style={{ padding: '6px 0 10px 5px' }}>
                    No update available
                  </H100>
                )}
              </div>
            )
          }
        </ButtonGroup>
        <Checkbox
          isChecked={automaticUpdate === true}
          value={automaticUpdate}
          onChange={(ev) => {
            const { value } = ev.target;
            if (value === 'false') {
              setAutomaticUpdate(true);
            } else {
              setAutomaticUpdate(false);
            }
          }}
          label="Download and update automatically"
          name="allowAutomaticUpdate"
        />
      </Flex>
      <Flex column>
        <H100 style={{ padding: '12px 0 6px 0' }}>
          Configure whether to allow updating to latest prerelease version
        </H100>
        <Checkbox
          isChecked={channel === 'beta'}
          value={channel}
          onChange={(ev) => {
            const { value } = ev.target;
            if (value === 'stable') {
              setChannel('beta');
            } else {
              setChannel('stable');
            }
          }}
          label="Subscribe for pre-releases"
          name="allowPrerelease"
        />
        <H100 style={{
          color: '#FFAB00',
          fontWeight: 300,
          fontSize: 10,
          marginTop: 5,
        }}
        >
          Warning! Prerelease is not ready for production, is unstable and may contain bugs!
        </H100>
      </Flex>
    </Flex>
  </S.SettingsSectionContent>
);

export default UpdateSettings;
