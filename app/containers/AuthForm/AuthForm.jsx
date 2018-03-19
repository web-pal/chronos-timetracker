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
  FormProps,
} from 'redux-form';
import type {
  Dispatch,
} from 'types';

import {
  Flex,
} from 'components';
import {
  logoShadowed,
} from 'data/assets';
import {
  authActions,
  uiActions,
} from 'actions';
import {
  getUiState,
} from 'selectors';

import {
  validate,
} from './validation';

import EmailStep from './EmailStep';
import TeamStep from './TeamStep';
import AccountsStep from './AccountsStep';

import AuthDebugger from './AuthDebugger';

import {
  Hint,
  ContentOuter,
  Container,
  Logo,
  LoginInfo,
  AuthDebugContainer,
} from './styled';

type Props = {
  showAuthDebugConsole: boolean,
  loginRequestInProcess: boolean,
  loginError: string,
  isPaidUser: boolean,
  accounts: Array<{| host: string, username: string |}>,
  host: string | null,
  step: number,
  dispatch: Dispatch,
} & FormProps

const AuthForm: StatelessFunctionalComponent<Props> = ({
  showAuthDebugConsole,
  loginRequestInProcess,
  loginError,
  isPaidUser,
  accounts,
  host,
  step,
  handleSubmit,
  dispatch,
}: Props): Node =>
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
        {accounts.length > 0 &&
          <AccountsStep
            isActiveStep={step === 0}
            dispatch={dispatch}
            accounts={accounts}
            onContinue={handleSubmit((data) => {
              dispatch(authActions.loginRequest(data));
            })}
            loginError={loginError}
            onBack={() => {
              dispatch(uiActions.setUiState('authFormStep', 1));
            }}
          />
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
          loginError={loginError}
        />
        <EmailStep
          isActiveStep={step === 2}
          onContinue={handleSubmit((data) => {
            dispatch(authActions.loginRequest(data));
          })}
          loginError={loginError}
          onBack={() => {
            dispatch(uiActions.setUiState('authFormStep', 1));
          }}
          onJiraClick={() => {
            if (host !== null && host.length) {
              dispatch(authActions.loginOAuthRequest(host));
            } else {
              dispatch(uiActions.setUiState('loginError', 'You need to fill JIRA host first'));
            }
          }}
          loginRequestInProcess={loginRequestInProcess}
          isPaidUser={isPaidUser}
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
  </Container>;

const selector = formValueSelector('auth');
function mapStateToProps(state) {
  return {
    showAuthDebugConsole: getUiState('showAuthDebugConsole')(state),
    host: selector(state, 'host'),
    step: getUiState('authFormStep')(state),
    accounts: getUiState('accounts')(state),
    loginError: getUiState('loginError')(state),
    loginRequestInProcess: getUiState('loginRequestInProcess')(state),
    // Temporary block OAuth
    isPaidUser: false,
  };
}

const AuthFormDecorated = reduxForm({
  form: 'auth',
  validate,
})(AuthForm);

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(AuthFormDecorated);
