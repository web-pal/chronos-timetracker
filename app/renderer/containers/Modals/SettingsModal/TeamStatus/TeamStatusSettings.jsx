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
  H100,
} from 'styles/typography';
import {
  Flex,
} from 'components';

import * as S from './styled';


type Props = {
  saveUsers: (value: any) => void,
  isUsersFetching: boolean,
}

const TeamStatusSettings: StatelessFunctionalComponent<Props> = ({
  isUsersFetching,
  saveUsers,
}: Props): Node => {
  const [usersIds, setUsersIds] = useState([]);
  return (
    <S.SettingsSectionContent>
      <S.ContentLabel>
        Team Status
      </S.ContentLabel>
      <Flex
        style={{
          marginLeft: '6px',
        }}
        column
      >
        <H100 style={{ margin: '0 0 4px 0' }}>
          Configure users to show in tray widget
        </H100>
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
    </S.SettingsSectionContent>
  );
};

export default TeamStatusSettings;
