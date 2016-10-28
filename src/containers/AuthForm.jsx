import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form/immutable';

import * as jiraActions from '../actions/jira';
import Flex from '../components/Base/Flex/Flex';
import Checkbox from '../components/Checkbox/Checkbox';

function mapDispatchToProps(dispatch) {
  return bindActionCreators(jiraActions, dispatch);
}

function mapStateToProps(state) {
  return {
    initialValues: state.get('jira').credentials,
  };
}

@reduxForm({ form: 'auth' })
@connect(mapStateToProps, mapDispatchToProps)
export default class AuthForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    connect: PropTypes.func.isRequired,
    getSelf: PropTypes.func.isRequired,
    setAuthSucceeded: PropTypes.func.isRequired,
    getSavedCredentials: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.getSavedCredentials()
      .then(
        () => this.props.initialize(this.props.initialValues.toJS())
      );
  }

  submit = (values) => {
    this.props.connect(values)
      .then(
        () => this.props.getSelf()
      )
      .then(
        () => this.props.setAuthSucceeded()
      );
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <Flex column centered className="occupy-height">
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
              <button className="button button-success flex-item--end" type="submit">Login</button>
            </Flex>
          </form>
        </Flex>
      </Flex>
    );
  }
}
