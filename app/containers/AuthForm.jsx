import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form/immutable';
import Joi from 'joi';

import * as jiraActions from '../actions/jira';
import Flex from '../components/Base/Flex/Flex';
import Checkbox from '../components/Checkbox/Checkbox';

import logo from '../assets/images/logo256x256.png';

const spinner = require('../assets/images/ring-alt.svg');

const validate = values => {
  const errors = {}
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
}


const renderField = ({ input, label, type, placeholder, meta: { touched, error, warning } }) => (
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
)

@reduxForm({ form: 'auth', validate })
class AuthForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object.isRequired,
    error: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    connect: PropTypes.func.isRequired,
    jwtConnect: PropTypes.func.isRequired,
    setAuthSucceeded: PropTypes.func.isRequired,
    getSavedCredentials: PropTypes.func.isRequired,
    getJWT: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.getSavedCredentials()
      .then(
        () => {
          this.props.initialize(this.props.initialValues.toJS());
          return this.props.getJWT();
        }
      )
      .then(
        result => this.props.jwtConnect(result.payload.token)
      )
      .then(
        () => this.props.setAuthSucceeded()
      )
      .catch(e => {});
  }

  submit = (values) => {
    this.props.connect(values)
      .then(
        () => this.props.setAuthSucceeded(),
        err => {},
      );
  }

  render() {
    const {
      handleSubmit,
      fetching,
      jiraError,
    } = this.props;
    return (
      <Flex column centered className="occupy-height draggable">
        {fetching &&
          <div className="connect-fetching">
            <img src={spinner} alt="" />
          </div>
        }
        <Flex row centered className="logo">
          <img src={logo} height={107}/>
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
              <button className="button button-primary" type="submit">Login</button>
            </Flex>
            {jiraError &&
              <span className="error">
                {jiraError}
              </span>
            }
          </form>
        </Flex>
      </Flex>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(jiraActions, dispatch);
}

function mapStateToProps({ jira, ui }) {
  return {
    initialValues: jira.credentials,
    jiraError: jira.error,
    fetching: jira.fetching,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthForm);
