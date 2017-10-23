// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import { Flex, SingleSelect } from 'components';
import { H100 } from 'styles/typography';
import Button, { ButtonGroup } from '@atlaskit/button';
import { remote } from 'electron';
import Spinner from '@atlaskit/spinner';
import { openURLInBrowser } from 'external-open-util';

import { SettingsSectionContent, ContentLabel } from './styled';
import { version } from '../../../package.json';
import type { UpdateInfo, InstallUpdateRequest } from '../../../types';

const { autoUpdater } = remote.require('electron-updater');

const updateChannels = [{
  heading: 'Channels',
  items: [
    { content: 'Stable', value: 'stable' },
    { content: 'Beta', value: 'beta' },
  ],
}];

const updateItemsMap = {
  stable: { content: 'Stable', value: 'stable' },
  beta: { content: 'Beta', value: 'beta' },
};

type Props = {
  channel: string,
  updateCheckRunning: boolean,
  updateAvailable: UpdateInfo,
  updateFetching: boolean,

  setChannel: any,
  installUpdateRequest: InstallUpdateRequest,
};

const UpdateSettings: StatelessFunctionalComponent<Props> = ({
  channel,
  setChannel,
  updateCheckRunning,
  updateAvailable,
  updateFetching,
  installUpdateRequest,
}: Props): Node => (
  <SettingsSectionContent style={{ width: '100%' }}>
    <ContentLabel>
      Updates
    </ContentLabel>
    <Flex column>
      <Flex row spaceBetween>
        <Flex column>
          <H100 style={{ padding: '6px 0 10px 0' }}>
            {updateAvailable
              ? `New version (${updateAvailable}) is available.`
              : `You have latest version (${version}).`
            }
          </H100>
          <ButtonGroup>
            {updateAvailable
              ? <Flex column>
                <div>
                  <Button
                    appearance="primary"
                    onClick={installUpdateRequest}
                    iconAfter={updateFetching ? <Spinner invertColor /> : false}
                  >
                    {updateFetching
                      ? 'Updating'
                      : 'Update now'
                    }
                  </Button>
                </div>
                <div style={{ fontSize: 11, paddingTop: 2 }}>
                  <span> or </span>
                  <Button
                    appearance="link"
                    spacing="none"
                    onClick={openURLInBrowser('https://github.com/web-pal/Chronos/releases')}
                  >
                    download latest release manually
                  </Button>
                </div>
              </Flex>
              : <Button
                isDisabled={updateCheckRunning}
                onClick={() => autoUpdater.checkForUpdates()}
                iconAfter={updateCheckRunning ? <Spinner /> : false}
              >
                {updateCheckRunning
                  ? 'Checking for updates'
                  : 'Check for updates'
                }
              </Button>
            }
          </ButtonGroup>
        </Flex>
        <Flex column style={{ width: 150 }}>
          <H100 style={{ padding: '6px 0 6px 0' }}>
            Update channel
          </H100>
          <SingleSelect
            items={updateChannels}
            onSelected={({ item }) => {
              setChannel(item.value);
            }}
            defaultSelected={updateItemsMap[channel]}
            shouldFitContiner
          />
        </Flex>
      </Flex>
    </Flex>
  </SettingsSectionContent>
);

export default UpdateSettings;
