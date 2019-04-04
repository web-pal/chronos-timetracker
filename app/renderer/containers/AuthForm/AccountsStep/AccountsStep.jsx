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

import * as S from '../styled';


type Props = {
  isActiveStep: boolean,
  authError: string,
  dispatch: Function,
  onBack: Function,
  accounts: Array<Account>,
};

const AccountsStep = ({
  isActiveStep,
  authError,
  onBack,
  dispatch,
  accounts,
}: Props) => (
  <S.ContentInner
    isActiveStep={isActiveStep}
    step={0}
  >
    <div>
      {accounts.map(ac => (
        <S.Account
          onClick={() => dispatch(authActions.switchAccount(ac))}
          key={`${ac.name}:${ac.hostname}`}
        >
          <Tag text={ac.hostname} color="teal" />
          {ac.name}
        </S.Account>
      ))}
    </div>
    <S.BackButton>
      <Button
        appearance="subtle"
        onClick={onBack}
      >
        Back
      </Button>
    </S.BackButton>
    <S.Error>{authError}</S.Error>
  </S.ContentInner>
);

export default AccountsStep;
