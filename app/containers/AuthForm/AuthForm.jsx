// goal:  https://dribbble.com/shots/3768074-Modal-windows
import React, { PropTypes, Component } from 'react';
import { logoShadowed } from 'data/assets';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm, formValueSelector } from 'redux-form/immutable';
import { ipcRenderer } from 'electron';
import storage from 'electron-json-storage';

import * as profileActions from '../../actions/profile';

import { validate } from './validation';
import { rememberToken } from '../../utils/api/helper';
import Flex from '../../components/Base/Flex/Flex';

import TeamStep from './Steps/TeamStep';
import EmailStep from './Steps/EmailStep';

import {
  Hint,
  ContentOuter,
  Container,
  Logo,
  LoginInfo,
} from './styled';


@reduxForm({ form: 'auth', validate })
class AuthForm extends Component {
  static propTypes = {
    loginRequestInProcess: PropTypes.bool.isRequired,

    loginError: PropTypes.string.isRequired,

    login: PropTypes.func.isRequired,
    loginOAuth: PropTypes.func.isRequired,
    continueOAuthWithCode: PropTypes.func.isRequired,
    deniedOAuth: PropTypes.func.isRequired,
    throwLoginError: PropTypes.func.isRequired,
    checkJWT: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    initialize: PropTypes.func,
    host: PropTypes.string.isRequired,
  }

  static defaultProps = {
    handleSubmit: () => {},
    initialize: () => {},
  }

  state = {
    step: 1,
  }

  componentDidMount() {
    storage.get('jira_credentials', (err, credentials) => {
      if (!err && credentials && Object.keys(credentials)) {
        this.setState({ step: 2 });
        this.props.initialize(credentials);
      }
    });
    storage.get('desktop_tracker_jwt', (err, token) => {
      if (!err && token && Object.keys(token).length) {
        rememberToken(token);
        this.props.checkJWT();
      }
    });
    ipcRenderer.on('oauth-code', this.onOauthCode);
    ipcRenderer.on('oauth-denied', this.onOauthDenied);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('oauth-code', this.onOauthCode);
    ipcRenderer.removeListener('oauth-denied', this.onOauthDenied);
  }

  onOauthCode = (ev, code) => {
    this.props.continueOAuthWithCode(code);
  }

  onOauthDenied = () => {
    this.props.deniedOAuth();
  }

  oAuth = () => {
    if (this.props.host && this.props.host.length) {
      storage.set('jira_credentials', { host: this.props.host });
      this.props.throwLoginError('');
      this.props.loginOAuth({ host: `${this.props.host}.atlassian.net` });
    } else {
      this.props.throwLoginError('You need to fill JIRA host at first');
    }
  }

  submit = values => (
    new Promise((resolve, reject) => {
      this.props.login({ values: values.toJS(), resolve, reject });
    })
  )

  render() {
    const { handleSubmit, loginRequestInProcess, loginError } = this.props;
    const { step } = this.state;

    return (
      <Container>
        <Logo src={logoShadowed} alt="Chronos" />
        <Flex column alignCenter>
          <LoginInfo>Log in to your account</LoginInfo>
          <ContentOuter>
            <TeamStep
              onContinue={() => this.setState({ step: 2 })}
              isActiveStep={step === 1}
            />
            <EmailStep
              onContinue={handleSubmit(this.submit)}
              onJiraClick={this.oAuth}
              error={loginError}
              isActiveStep={step === 2}
              onBack={() => this.setState({ step: 1 })}
              loginRequestInProcess={loginRequestInProcess}
            />
          </ContentOuter>
        </Flex>
        <Hint>{"Can't log in?"}</Hint>
      </Container>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(profileActions, dispatch);
}

function mapStateToProps({ profile, form }) {
  const selector = formValueSelector('auth');
  return {
    loginError: profile.loginError,
    loginRequestInProcess: profile.loginRequestInProcess,
    host: selector({ form }, 'host') || '',
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthForm);
