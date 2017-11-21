// @flow
// goal:  https://dribbble.com/shots/3768074-Modal-windows
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { ipcRenderer } from 'electron';
import storage from 'electron-json-storage';
import { Flex } from 'components';
import type { FormProps } from 'redux-form';
import { logoShadowed } from 'data/assets';
import { profileActions, uiActions } from 'actions';
import { getAuthFormStep, getLoginError, getLoginFetching } from 'selectors';
import type {
  LoginRequest,
  LoginOAuthRequest,
  DenyOAuth,
  CheckJWTRequest,
  SetAuthFormStep,
} from '../../types';

import { validate } from './validation';

import TeamStep from './Steps/TeamStep';
import EmailStep from './Steps/EmailStep';

import { Hint, ContentOuter, Container, Logo, LoginInfo } from './styled';

type Props = {
  loginRequest: LoginRequest,
  loginOAuthRequest: LoginOAuthRequest,
  denyOAuth: DenyOAuth,
  checkJWTRequest: CheckJWTRequest,
  setAuthFormStep: SetAuthFormStep,

  host: string | null,
  step: number,
  loginError: string,
  fetching: boolean,
}
// } & FormProps

class AuthForm extends Component<Props> {
  static defaultProps = {
    host: '',
  }

  componentDidMount() {
    storage.get('jira_credentials', (err, credentials) => {
      if (!err && credentials && Object.keys(credentials)) {
        if (credentials.host && credentials.host !== '') {
          this.props.setAuthFormStep(2);
        }
        this.props.initialize(credentials);
      }
    });
    storage.get('desktop_tracker_jwt', (err, token) => {
      if (!err && token && Object.keys(token).length) {
        this.props.checkJWTRequest();
      }
    });
    ipcRenderer.on('oauth-accepted', this.onOauthAccepted);
    ipcRenderer.on('oauth-denied', this.onOauthDenied);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('oauth-accepted', this.onOauthAccepted);
    ipcRenderer.removeListener('oauth-denied', this.onOauthDenied);
  }

  onOauthAccepted = (_, code) => {
    this.props.acceptOAuth(code);
  }

  onOauthDenied = () => {
    this.props.denyOAuth();
  }

  oAuth = () => {
    if (this.props.host && this.props.host.length) {
      storage.set('jira_credentials', { host: this.props.host });
      this.props.loginOAuthRequest(`${this.props.host}.atlassian.net`);
    } else {
      this.props.throwLoginError('You need to fill JIRA host at first');
    }
  }

  render() {
    const {
      handleSubmit,
      step,
      setAuthFormStep,
      loginError,
      fetching,
    } = this.props;

    return (
      <Container>
        <Logo src={logoShadowed} alt="Chronos" />
        <Flex column alignCenter>
          <LoginInfo>Log in to your account</LoginInfo>
          <ContentOuter>
            <TeamStep
              onContinue={() => setAuthFormStep(2)}
              isActiveStep={step === 1}
            />
            <EmailStep
              onContinue={handleSubmit(this.props.loginRequest)}
              onJiraClick={this.oAuth}
              loginError={loginError}
              isActiveStep={step === 2}
              onBack={() => setAuthFormStep(1)}
              loginRequestInProcess={fetching}
            />
          </ContentOuter>
        </Flex>
        <Hint>Can not log in?</Hint>
      </Container>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...profileActions, ...uiActions }, dispatch);
}

function mapStateToProps(state) {
  const selector = formValueSelector('auth');
  return {
    host: selector(state, 'host'),
    step: getAuthFormStep(state),
    loginError: getLoginError(state),
    fetching: getLoginFetching(state),
  };
}

const AuthFormDecorated = reduxForm({
  form: 'auth',
  validate,
})(AuthForm);

export default connect(mapStateToProps, mapDispatchToProps)(AuthFormDecorated);
