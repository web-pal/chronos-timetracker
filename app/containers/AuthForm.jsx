import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form/immutable';
import storage from 'electron-json-storage';

import * as profileActions from '../actions/profile';

import Flex from '../components/Base/Flex/Flex';
import Checkbox from '../components/Checkbox/Checkbox';

import { rememberToken } from '../utils/api/helper';
import logo from '../assets/images/logo256x256.png';

const spinner = require('../assets/images/ring-alt.svg');

const validate = (values) => {
  const errors = {};
  if (!values.get('host')) {
    errors.host = 'Requried';
  }
  if (!values.get('username')) {
    errors.username = 'Requried';
  }
  if (!values.get('password')) {
    errors.password = 'Requried';
  }
  return errors;
};


const renderField = ({
  input, label, type, placeholder, meta: { touched, error, warning } //eslint-disable-line
}) => (
  <div className={`form-element ${label}`}>
    <Flex row>
      <label htmlFor={label}>{label}</label>
      {touched && error && <span className="error">{error}</span>}
    </Flex>
    <input
      {...input}
      type={type}
      placeholder={placeholder}
      className={`${error && touched ? 'withError' : ''}`}
    />
  </div>
);

@reduxForm({ form: 'auth', validate })
class AuthForm extends Component {
  static propTypes = {
    loginRequestInProcess: PropTypes.bool.isRequired,

    loginError: PropTypes.string.isRequired,

    login: PropTypes.func.isRequired,
    checkJWT: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
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
  }

  submit = values => (
    new Promise((resolve, reject) => {
      this.props.login({ values: values.toJS(), resolve, reject });
    })
  )

  render() {
    const { handleSubmit, loginRequestInProcess, loginError } = this.props;
    return (
      <Flex column centered className="occupy-height draggable">
        {loginRequestInProcess &&
          <div className="connect-fetching">
            <img src={spinner} alt="" />
          </div>
        }
        <Flex row centered className="logo">
          <img alt="logo" src={logo} height={107} />
        </Flex>
        <Flex row centered>
          <form onSubmit={handleSubmit(this.submit)} className="form">
            <div>
              <Flex row className="form-element">
                <Field name="host" placeholder="JIRA host*" component="input" type="text" className="host" />
                <input disabled value=".atlassian.net" className="hostPlaceholder" />
              </Flex>
            </div>
            <Field name="username" placeholder="Username*" component={renderField} type="text" />
            <Field name="password" placeholder="Password*" component={renderField} type="password" />
            <div className="form-element">
              <Field
                label="Remember me "
                name="memorize"
                type="checkbox"
                component={Checkbox}
              />
            </div>
            <Flex row>
              <button
                className="button button-primary"
                type="submit"
                disabled={loginRequestInProcess}
              >
                Login
              </button>
            </Flex>
            <span className="error">
              {loginError}
            </span>
          </form>
        </Flex>
      </Flex>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(profileActions, dispatch);
}

function mapStateToProps({ profile }) {
  return {
    loginError: profile.loginError,
    loginRequestInProcess: profile.loginRequestInProcess,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthForm);
