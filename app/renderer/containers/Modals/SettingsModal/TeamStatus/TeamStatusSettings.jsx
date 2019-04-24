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

import UserPicker from '@atlaskit/user-picker';
import Spinner from '@atlaskit/spinner';
import Button, {
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
      <Flex column>
        <H100 style={{ margin: '0 0 4px 6px' }}>
          Configure users to show in tray widget
        </H100>
        <IntlProvider locale="en">
          <UserPicker
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
          <Button
            style={{
              marginLeft: '6px',
            }}
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
          </Button>
        </ButtonGroup>
        <br />
      </Flex>
    </S.SettingsSectionContent>
  );
};

export default TeamStatusSettings;
