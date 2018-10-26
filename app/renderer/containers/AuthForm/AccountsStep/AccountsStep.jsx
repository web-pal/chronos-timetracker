// @flow
import React from 'react';
import {
  authActions,
} from 'actions';

import Button from '@atlaskit/button';
import Tag from '@atlaskit/tag';

import {
  transformValidHost,
} from '../../../sagas/auth';

import {
  ContentInner,
  BackButtonContainer,
  Error,
  Account,
} from '../styled';


type Props = {
  isActiveStep: boolean,
  authError: string,
  dispatch: Function,
  onBack: Function,
  accounts: Array<{| origin: string, name: string |}>,
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
        <Account
          onClick={() => dispatch(authActions.switchAccount(ac))}
          key={`${ac.name}:${ac.origin}`}
        >
          <Tag text={transformValidHost(ac.origin).hostname} color="teal" />
          {ac.name}
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
    <Error>{authError}</Error>
  </ContentInner>
);

export default AccountsStep;
