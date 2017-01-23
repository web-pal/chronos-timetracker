import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form/immutable';

import * as jiraActions from '../actions/jira';
import Flex from '../components/Base/Flex/Flex';
import Checkbox from '../components/Checkbox/Checkbox';

const spinner = require('../assets/images/ring-alt.svg');

@reduxForm({ form: 'auth' })
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
      );
  }

  submit = (values) => {
    this.props.connect(values)
      .then(
        () => this.props.setAuthSucceeded(),
        err => console.error(err)
      );
  }

  render() {
    const { handleSubmit, fetching, error } = this.props;
    return (
      <Flex column centered className="occupy-height draggable">
        {fetching === 'connect' &&
          <div className="connect-fetching">
            <img src={spinner} alt="" />
          </div>
        }
        <Flex row centered>
          <form onSubmit={handleSubmit(this.submit)} className="form">
            <div className="form-element">
              <label htmlFor="host">JIRA host</label>
              <Field name="host" component="input" type="text" />
            </div>
            <div className="form-element">
              <label htmlFor="username">Username</label>
              <Field name="username" component="input" type="text" />
            </div>
            <div className="form-element">
              <label htmlFor="password">Password</label>
              <Field name="password" component="input" type="password" />
            </div>
            <div className="form-element">
              <Field
                label="Remember? "
                name="memorize"
                type="checkbox"
                component={Checkbox}
              />
            </div>
            <Flex row>
              <span className="error">
                {error && error.toString()}
              </span>
              <button className="button button-success flex-item--end" type="submit">Login</button>
            </Flex>
          </form>
        </Flex>
      </Flex>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(jiraActions, dispatch);
}

function mapStateToProps({ jira }) {
  return {
    initialValues: jira.credentials,
    error: jira.error,
    fetching: false,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthForm);
