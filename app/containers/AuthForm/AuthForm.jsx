// goal:  https://dribbble.com/shots/3768074-Modal-windows
import React, { PropTypes, Component } from 'react';
import { logoShadowed } from 'data/assets';
import { jiraIcon, lockBlue, peopleBlue } from 'data/svg';
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
import Flex from '../../components/Base/Flex/Flex';

import {
  Hint,
  ContentInner,
  ContentOuter,
  Container,
  Logo,
  PrimaryButton,
  OauthButton,
  LoginInfo,
  ContentSeparator,
  Error,
  Form,
  Lock,
  ContentIconContainer,
  Title,
  Subtitle,
  SpinnerContainer,
} from './styled';


// eslint-disable-next-line
const TeamStep = ({ onContinue, isActiveStep }) => (
  <ContentInner isActiveStep={isActiveStep} step={1}>
    <ContentIconContainer>
      <Lock src={peopleBlue} alt="" width="24" />
    </ContentIconContainer>
    <Flex column alignCenter style={{ width: '100%' }}>
      <Title>Enter your team</Title>
      <Subtitle>Please fill in your JIRA host</Subtitle>
      <Form>
        <Field
          name="host"
          placeholder="web-pal"
          component={renderField}
          type="text"
          className="host"
          mask=".atlassian.net"
          autoFocus
          underlined
        />
      </Form>
    </Flex>
    <PrimaryButton onClick={onContinue}>
      Continue
    </PrimaryButton>
  </ContentInner>
);

// eslint-disable-next-line
const EmailStep = ({ error, onContinue, onJiraClick, isActiveStep }) => (
  <ContentInner isActiveStep={isActiveStep} step={2}>
    <ContentIconContainer>
      <Lock src={lockBlue} alt="" width="18" />
    </ContentIconContainer>
    <Flex column alignCenter style={{ width: '100%' }}>
      <OauthButton onClick={onJiraClick}>
        <img src={jiraIcon} alt="" style={{ height: 20 }} />
        Log in with JIRA
      </OauthButton>
      <ContentSeparator>OR</ContentSeparator>
      <Field
        name="username"
        placeholder="Enter email"
        component={renderField}
        type="text"
        autoFocus
      />
      <Field
        name="password"
        placeholder="Enter password"
        component={renderField}
        type="password"
      />
      <Error>{error}</Error>
    </Flex>
    <PrimaryButton onClick={onContinue}>
      Continue
    </PrimaryButton>
  </ContentInner>
);

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

  state = {
    step: 1,
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
    const { step } = this.state;
    console.log(step);

                // <Content style={{ justifyContent: 'center' }}>
                // </Content>
    return (
      <Container>
        <Logo src={logoShadowed} alt="Chronos" />
        <Flex column alignCenter>
          <LoginInfo>Log in to your account</LoginInfo>
          <ContentOuter>
            {loginRequestInProcess &&
              <SpinnerContainer>
                <Spinner size="xlarge" />
              </SpinnerContainer>
            }
            <TeamStep
              onContinue={() => this.setState({ step: 2 })}
              isActiveStep={step === 1}
            />
            <EmailStep
              onContinue={handleSubmit(this.submit)}
              onJiraClick={this.oAuth}
              error={loginError}
              isActiveStep={step === 2}
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
