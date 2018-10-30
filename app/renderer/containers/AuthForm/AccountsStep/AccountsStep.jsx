// @flow
import React from 'react';
import type {
  Account,
} from 'types';
import {
  authActions,
} from 'actions';

import Button from '@atlaskit/button';
import Tag from '@atlaskit/tag';

import {
  ContentInner,
  BackButtonContainer,
  Error,
  AccountContainer,
} from '../styled';


type Props = {
  isActiveStep: boolean,
  authError: string,
  dispatch: Function,
  onBack: Function,
  accounts: Array<Account>,
}

const AccountsStep = ({
  isActiveStep,
  authError,
  onBack,
  dispatch,
  accounts,
}: Props) => (
  <ContentInner
    isActiveStep={isActiveStep}
    step={0}
  >
    <div>
      {accounts.map(ac => (
        <AccountContainer
          onClick={() => dispatch(authActions.switchAccount(ac))}
          key={`${ac.name}:${ac.hostname}`}
        >
          <Tag text={ac.hostname} color="teal" />
          {ac.name}
        </AccountContainer>
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
    <Error>{authError}</Error>
  </ContentInner>
);

export default AccountsStep;
