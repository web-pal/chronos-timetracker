import React, { PropTypes, Component } from 'react';
import { logoShadowed } from 'data/assets';
import { jiraIcon } from 'data/svg';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable';
import { ipcRenderer } from 'electron';
import storage from 'electron-json-storage';
import Spinner from '@atlaskit/spinner';

import * as profileActions from '../../actions/profile';

import { validate } from './validation';
import { renderField } from './Form';
import { rememberToken } from '../../utils/api/helper';
// import Flex from '../../components/Base/Flex/Flex';

import {
  Hint,
  Content,
  Container,
  Logo,
  PrimaryButton,
  OauthButton,
  LoginInfo,
  ContentSeparator,
  Error,
  Form,
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
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    host: PropTypes.string.isRequired,
  }

  componentDidMount() {
    storage.get('jira_credentials', (err, credentials) => {
      if (!err && credentials && Object.keys(credentials)) {
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
    // {loginRequestInProcess &&
    //   <h2>IN PROGRESS</h2>
    // }

    return (
      <Container>
        <Logo src={logoShadowed} alt="Chronos" />
        <LoginInfo>Log in to your account</LoginInfo>
        {loginRequestInProcess ?
          <Content style={{ justifyContent: 'center' }}>
            <Spinner size="xlarge" />
          </Content>
        :
          <Content>
            <OauthButton onClick={this.oAuth}>
              <img src={jiraIcon} alt="" style={{ height: 20 }} />
              Log in with JIRA
            </OauthButton>
            <ContentSeparator>OR</ContentSeparator>
            <Form>
              <Field
                name="host"
                placeholder="web-pal"
                component={renderField}
                type="text"
                className="host"
                autoFocus
                mask=".atlassian.net"
              />
              <Field
                name="username"
                placeholder="Enter email"
                component={renderField}
                type="text"
              />
              <Field
                name="password"
                placeholder="Enter password"
                component={renderField}
                type="password"
                style={{ marginBottom: 5 }}
              />
              <Error>{loginError}</Error>
              <PrimaryButton onClick={handleSubmit(this.submit)}>
                Continue
              </PrimaryButton>
            </Form>
          </Content>
        }
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
