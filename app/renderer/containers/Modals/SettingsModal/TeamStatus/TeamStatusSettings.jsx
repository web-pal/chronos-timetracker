// @flow
import React, {
  useState,
} from 'react';
import {
  IntlProvider,
} from 'react-intl';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

import {
  jiraApi,
} from 'api';

import Spinner from '@atlaskit/spinner';
import {
  ButtonGroup,
} from '@atlaskit/button';

import {
  CheckboxGroup,
} from 'styles';

import {
  Checkbox,
} from '@atlaskit/checkbox';

import {
  H100,
} from 'styles/typography';
import {
  Flex,
} from 'components';

import * as S from './styled';

type Props = {
  isUsersFetching: boolean,
  teamStatusEnabled: boolean,
  teamStatusWindowLoading: boolean,
  toggleTeamStatus: (value: boolean) => void,
  saveUsers: (value: any) => void,
}

const TeamStatusSettings: StatelessFunctionalComponent<Props> = ({
  isUsersFetching,
  teamStatusEnabled,
  teamStatusWindowLoading,
  toggleTeamStatus,
  saveUsers,
}: Props): Node => {
  const [usersIds, setUsersIds] = useState([]);
  return (
    <S.SettingsSectionContent>
      <S.ContentLabel>
        Team Status
      </S.ContentLabel>
      <Flex column>
        <H100 style={{ margin: '0 0 4px 6px' }}>
          Configure users to show in tray widget
        </H100>
        <CheckboxGroup
          style={{
            marginLeft: '2px',
          }}
        >
          <Checkbox
            isDisabled={teamStatusWindowLoading}
            name="enableTeamStatus"
            id="enableTeamStatus"
            isChecked={teamStatusEnabled}
            label="Enable team status showing in tray"
            onChange={toggleTeamStatus}
          />
        </CheckboxGroup>
        {teamStatusEnabled && (
          <Flex
            column
            style={{
              margin: '0 0 4px 6px',
            }}
          >
            <IntlProvider locale="en">
              <S.UsersPicker
                fieldId="userPicker"
                isMulti
                onChange={(data) => {
                  setUsersIds(data.map(({ id }) => id));
                }}
                placeholder="Type name to search"
                loadOptions={
                  inputValue => (
                    jiraApi.searchForUsers({
                      params: {
                        query: inputValue,
                        excludeConnectUsers: true,
                        showAvatar: true,
                        maxResults: 100,
                      },
                    })
                      .then(({ users }) => (
                        users.map(user => ({
                          id: user.accountId,
                          name: user.displayName,
                          type: 'user',
                          avatarUrl: user.avatarUrl,
                        }))))
                  )
                }
              />
            </IntlProvider>
            <br />
            <ButtonGroup>
              <S.SaveButton
                appearance="primary"
                iconAfter={(
                  <Spinner
                    invertColor
                    isCompleting={!isUsersFetching}
                  />
                )}
                onClick={() => saveUsers(usersIds)}
              >
                Save
              </S.SaveButton>
            </ButtonGroup>
            <br />
          </Flex>
        )}
      </Flex>
    </S.SettingsSectionContent>
  );
};

export default TeamStatusSettings;
