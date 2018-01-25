// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';
import {
  bindActionCreators,
} from 'redux';
import {
  reduxForm,
  formValueSelector,
  FormProps,
} from 'redux-form';

import type {
  Node,
  StatelessFunctionalComponent,
} from 'react';

import {
  Flex,
} from 'components';
import {
  logoShadowed,
} from 'data/assets';
import {
  profileActions,
  authActions,
  uiActions,
} from 'actions';
import {
  getAuthFormStep,
  getLoginError,
  getLoginFetching,
} from 'selectors';
import type {
  LoginRequest,
  LoginOAuthRequest,
  DenyOAuth,
  AcceptOAuth,
  ThrowLoginError,
  SetAuthFormStep,
} from '../../types';

import { validate } from './validation';

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
  loginRequest: LoginRequest,
  loginOAuthRequest: LoginOAuthRequest,
  denyOAuth: DenyOAuth,
  acceptOAuth: AcceptOAuth,
  throwLoginError: ThrowLoginError,
  setAuthFormStep: SetAuthFormStep,
  isPaidUser: boolean,

  host: string | null,
  step: number,
  loginError: string,
  fetching: boolean,
  handleSubmit: any,
} & FormProps

const AuthForm: StatelessFunctionalComponent<Props> = ({
  handleSubmit,
  loginRequest,
  loginOAuthRequest,
  throwLoginError,
  host,
  step,
  setAuthFormStep,
  loginError,
  fetching,
  isPaidUser,
}: Props): Node =>
  <Container>
    <Logo src={logoShadowed} alt="Chronos" />
    <Flex column alignCenter>
      <LoginInfo>Log in to your account</LoginInfo>
      <ContentOuter>
        <TeamStep
          isActiveStep={step === 1}
          onContinue={() => setAuthFormStep(2)}
          loginError={loginError}
        />
        <EmailStep
          isActiveStep={step === 2}
          onContinue={handleSubmit(loginRequest)}
          loginError={loginError}
          onBack={() => setAuthFormStep(1)}
          onJiraClick={() => {
            if (host !== null && host.length) {
              loginOAuthRequest(host);
            } else {
              throwLoginError('You need to fill JIRA host first');
            }
          }}
          loginRequestInProcess={fetching}
          isPaidUser={isPaidUser}
        />
      </ContentOuter>
    </Flex>
    <Hint>Can not log in?</Hint>
  </Container>;

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...profileActions,
    ...authActions,
    ...uiActions,
  }, dispatch);
}

const selector = formValueSelector('auth');
function mapStateToProps(state) {
  return {
    host: selector(state, 'host'),
    step: getAuthFormStep(state),
    loginError: getLoginError(state),
    fetching: getLoginFetching(state),
    // Temporary block OAuth
    isPaidUser: false,
  };
}

const AuthFormDecorated = reduxForm({
  form: 'auth',
  validate,
})(AuthForm);

export default connect(mapStateToProps, mapDispatchToProps)(AuthFormDecorated);
