// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';
import {
  formValueSelector,
} from 'redux-form';

import type {
  Node,
  StatelessFunctionalComponent,
} from 'react';
import type {
  Connector,
} from 'react-redux';
import type {
  Dispatch,
  Account,
} from 'types';

import {
  Flex,
} from 'components';
import {
  logoShadowed,
} from 'utils/data/assets';
import {
  authActions,
  uiActions,
} from 'actions';
import {
  getUiState,
} from 'selectors';

import TeamStep from './TeamStep';
import CloudLoginStep from './CloudLoginStep';
import SelfHostLoginStep from './SelfHostLoginStep';
import AccountsStep from './AccountsStep';

import AuthDebugger from './AuthDebugger';

import {
  Hint,
  ContentOuter,
  Container,
  Logo,
  LoginInfo,
} from './styled';

import {
  transformValidHost,
} from './utils';

type Props = {
  showAuthDebugConsole: boolean,
  authRequestInProcess: boolean,
  authError: string,
  authFormIsComplete: boolean,
  accounts: Array<Account>,
  team: string | null,
  step: number,
  dispatch: Dispatch,
};

const AuthForm: StatelessFunctionalComponent<Props> = ({
  showAuthDebugConsole,
  authRequestInProcess,
  authFormIsComplete,
  authError,
  accounts,
  team,
  step,
  dispatch,
}: Props): Node => (
  <Container>
    <AuthDebugger show={showAuthDebugConsole} />
    <Logo
      src={logoShadowed}
      alt="Chronos"
    />
    <Flex column alignCenter>
      <LoginInfo>
        Log in to your account
      </LoginInfo>
      <ContentOuter>
        {accounts.length > 0
          && (
          <AccountsStep
            isActiveStep={step === 0}
            dispatch={dispatch}
            accounts={accounts}
            authError={authError}
            onBack={() => {
              dispatch(uiActions.setUiState('authFormStep', 1));
            }}
          />
          )
        }
        <TeamStep
          isActiveStep={step === 1}
          accounts={accounts}
          onContinue={() => {
            const host = transformValidHost(team);
            if (host) {
              dispatch(
                uiActions.setUiState(
                  'authFormStep',
                  host.origin.endsWith('.atlassian.net') ? 2 : 3,
                ),
              );
              dispatch(uiActions.setUiState('authError', null));
            } else {
              dispatch(uiActions.setUiState('authError', 'Invalid Jira url'));
            }
          }}
          dispatch={dispatch}
          authError={authError}
          authRequestInProcess={authRequestInProcess}
        />
        <CloudLoginStep
          team={team}
          isActiveStep={step === 2}
          isComplete={authFormIsComplete}
          authRequestInProcess={authRequestInProcess}
          onContinue={(data) => {
            dispatch(authActions.authRequest(data));
          }}
          onError={(err) => {
            dispatch(uiActions.setUiState('authError', err));
          }}
          onBack={() => {
            dispatch(uiActions.setUiState('authFormStep', 1));
            dispatch(uiActions.setUiState('authFormIsComplete', false));
          }}
        />
        <SelfHostLoginStep
          isActiveStep={step === 3}
          authError={authError}
          authRequestInProcess={authRequestInProcess}
          onContinue={(data) => {
            dispatch(authActions.authSelfHostRequest({
              ...data,
              host: transformValidHost(team),
            }));
          }}
          onBack={() => {
            dispatch(uiActions.setUiState('authError', null));
            dispatch(uiActions.setUiState('authFormStep', 1));
            dispatch(uiActions.setUiState('authFormIsComplete', false));
          }}
        />
      </ContentOuter>
    </Flex>
    <Hint
      onClick={() => {
        dispatch(uiActions.setUiState(
          'showAuthDebugConsole',
          true,
        ));
      }}
    >
      Can not log in?
    </Hint>
  </Container>
);

const selector = formValueSelector('TeamStep');

const connector: Connector<{}, Props> = connect(
  state => ({
    team: selector(state, 'team'),
    step: getUiState('authFormStep')(state),
    authError: getUiState('authError')(state),
    authFormIsComplete: getUiState('authFormIsComplete')(state),
    authRequestInProcess: getUiState('authRequestInProcess')(state),
    accounts: getUiState('accounts')(state),
    showAuthDebugConsole: getUiState('showAuthDebugConsole')(state),
  }),
  dispatch => ({ dispatch }),
);

export default connector(AuthForm);
