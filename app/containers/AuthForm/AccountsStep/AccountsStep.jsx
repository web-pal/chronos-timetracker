// @flow
import React, { Component } from 'react';
import {
  authActions,
} from 'actions';

import Button from '@atlaskit/button';
import Tag from '@atlaskit/tag';

import {
  ContentInner,
  BackButtonContainer,
  Error,
  Account,
} from '../styled';


type Props = {
  isActiveStep: boolean,
  loginError: string,
  dispatch: Function,
  onBack: Function,
  accounts: Array<{| host: string, username: string |}>,
  onContinue: () => void,
}

const AccountsStep = ({
  isActiveStep,
  loginError,
  onContinue,
  onBack,
  dispatch,
  accounts,
}: Props) => (
  <ContentInner
    onKeyDown={(ev) => {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        ev.stopPropagation();
        onContinue();
      }
    }}
    isActiveStep={isActiveStep}
    step={0}
  >
    <div>
      {accounts.map(ac => (
        <Account
          onClick={() => dispatch(authActions.switchAccount(ac))}
          key={`${ac.username}:${ac.host}`}
        >
          <Tag text={ac.host} color="teal" />
          {ac.username}
        </Account>
      ))}
    </div>
    <BackButtonContainer>
      <Button
        appearance="subtle"
        onClick={onBack}
      >
        Back
      </Button>
    </BackButtonContainer>
    <Error>{loginError}</Error>
  </ContentInner>
);

export default AccountsStep;
