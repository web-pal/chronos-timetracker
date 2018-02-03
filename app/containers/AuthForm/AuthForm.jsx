// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';
import {
  reduxForm,
  formValueSelector,
  FormProps,
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

import {
  Hint,
  ContentOuter,
  Container,
  Logo,
  LoginInfo,
} from './styled';

type Props = {
  loginRequestInProcess: boolean,
  loginError: string,
  isPaidUser: boolean,
  host: string | null,
  step: number,
  dispatch: Dispatch,
} & FormProps

const AuthForm: StatelessFunctionalComponent<Props> = ({
  loginRequestInProcess,
  loginError,
  isPaidUser,
  host,
  step,
  handleSubmit,
  dispatch,
}: Props): Node =>
  <Container>
    <Logo src={logoShadowed} alt="Chronos" />
    <Flex column alignCenter>
      <LoginInfo>
        Log in to your account
      </LoginInfo>
      <ContentOuter>
        <TeamStep
          isActiveStep={step === 1}
          onContinue={() => {
            dispatch(
              uiActions.setUiState('authFormStep', 2),
            );
          }}
          loginError={loginError}
        />
        <EmailStep
          isActiveStep={step === 2}
          onContinue={handleSubmit((data) => {
            dispatch(authActions.loginRequest(data));
          })}
          loginError={loginError}
          onBack={() => dispatch(uiActions.setUiState('authFormStep', 1))}
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
    <Hint>Can not log in?</Hint>
  </Container>;

const selector = formValueSelector('auth');
function mapStateToProps(state) {
  return {
    host: selector(state, 'host'),
    step: getUiState('authFormStep')(state),
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
