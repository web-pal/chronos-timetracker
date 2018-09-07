// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';
import {
  reduxForm,
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

import validate from './validation';

import TeamStep from './TeamStep';
import LoginFormStep from './LoginFormStep';
import AccountsStep from './AccountsStep';

import AuthDebugger from './AuthDebugger';

import {
  Hint,
  ContentOuter,
  Container,
  Logo,
  LoginInfo,
} from './styled';

type Props = {
  showAuthDebugConsole: boolean,
  authRequestInProcess: boolean,
  authError: string,
  authFormIsComplete: boolean,
  accounts: Array<{| origin: string, name: string |}>,
  host: string | null,
  step: number,
  dispatch: Dispatch,
};

const AuthForm: StatelessFunctionalComponent<Props> = ({
  showAuthDebugConsole,
  authRequestInProcess,
  authFormIsComplete,
  authError,
  accounts,
  host,
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
            dispatch(
              uiActions.setUiState('authFormStep', 2),
            );
          }}
          dispatch={dispatch}
          authError={authError}
          authRequestInProcess={authRequestInProcess}
        />
        <LoginFormStep
          host={host}
          isActiveStep={step === 2}
          isComplete={authFormIsComplete}
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

const selector = formValueSelector('auth');
const AuthFormDecorated = reduxForm({
  form: 'auth',
  validate,
})(AuthForm);

const connector: Connector<{}, Props> = connect(
  state => ({
    showAuthDebugConsole: getUiState('showAuthDebugConsole')(state),
    host: selector(state, 'host'),
    step: getUiState('authFormStep')(state),
    authFormIsComplete: getUiState('authFormIsComplete')(state),
    accounts: getUiState('accounts')(state),
    authError: getUiState('authError')(state),
    authRequestInProcess: getUiState('authRequestInProcess')(state),
  }),
  dispatch => ({ dispatch }),
);

export default connector(AuthFormDecorated);
