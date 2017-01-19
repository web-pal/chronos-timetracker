import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import fs from 'fs';
import { remote } from 'electron';

import * as jiraActions from '../actions/jira';
import * as contextActions from '../actions/context';
import * as issuesActions from '../actions/issues';

import AuthForm from './AuthForm';
import Main from '../components/Main';

class App extends Component {
  static propTypes = {
    connected: PropTypes.bool.isRequired,
    currentProject: PropTypes.object.isRequired,
    fetchProjects: PropTypes.func.isRequired,
    fetchIssues: PropTypes.func.isRequired,
    fetchSettings: PropTypes.func.isRequired,
    fetchLastWeekLoggedIssues: PropTypes.func.isRequired,
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.connected && nextProps.connected) {
      const { getGlobal } = remote;
      const appDir = getGlobal('appDir');
      fs.access(`${appDir}/screenshots/`, fs.constants.R_OK | fs.constants.W_OK, (err) => {
        if (err) {
          fs.mkdirSync(`${appDir}/screenshots/`);
        }
      });
      fs.access(`${appDir}/worklogs/`, fs.constants.R_OK | fs.constants.W_OK, (err) => {
        if (err) {
          fs.mkdirSync(`${appDir}/worklogs/`);
        }
      });
      this.props.fetchProjects()
        .then(
          () => this.props.fetchSettings(),
        );
    }
    if (!this.props.currentProject.equals(nextProps.currentProject)) {
      // this.props.fetchLastWeekLoggedIssues();
      this.props.fetchIssues();
    }
  }

  render() {
    const { connected } = this.props;
    const view = connected
      ? <Main />
      : <AuthForm />;
    return view;
  }
}

function mapStateToProps({ jira, context }) {
  return {
    connected: jira.connected,
    currentProject: context.currentProject,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...jiraActions, ...contextActions, ...issuesActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
