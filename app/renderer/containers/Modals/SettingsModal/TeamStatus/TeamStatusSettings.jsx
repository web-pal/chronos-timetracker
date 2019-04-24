// @flow
import React, {
  useState,
} from 'react';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

import {
  jiraApi,
} from 'api';

import {
  Checkbox,
} from '@atlaskit/checkbox';

import Spinner from '@atlaskit/spinner';

import {
  components,
} from '@atlaskit/select';

import Button, {
  ButtonGroup,
} from '@atlaskit/button';

import {
  H100,
} from 'styles/typography';
import {
  CheckboxGroup,
} from 'styles';
import {
  Flex,
} from 'components';

import * as S from './styled';


type Props = {
  saveUsers: (value: any) => void,
  isUsersFetching: boolean,
}

const Option = ({
  innerRef,
  value,
  isSelected,
  label,
  ...props
}) => (
  <components.Option
    value={value}
    isSelected={isSelected}
    {...props}
  >
    <CheckboxGroup>
      <Checkbox
        key={value}
        isChecked={isSelected}
        value={isSelected}
        name={label}
        label={label}
        onChange={() => null}
      />
    </CheckboxGroup>
  </components.Option>
);

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
        <S.UsersSelect
          // closeOnSelect={false}
          closeMenuOnSelect={false}
          // onSelectResetsInput={false}
          // hideSelectedOptions={false}
          // blurInputOnSelect={false}
          defaultOptions
          isMulti
          components={{ Option }}
          // backspaceRemovesValue={false}
          onChange={(data) => {
            setUsersIds(data.map(({ value }) => value));
          }}
          cacheOptions
          loadOptions={inputValue => jiraApi.searchForUsers({
            params: {
              query: '%',
              maxResults: 100,
            },
          }).then(({ users: { users } }) => users
            .filter(({ displayName }) => displayName
              .toLowerCase()
              .includes(inputValue.toLowerCase()))
            .map(({
              displayName,
              accountId,
            }) => ({
              label: displayName,
              value: accountId,
            })))}
        />
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
