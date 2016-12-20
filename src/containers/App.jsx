import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import fs from 'fs';
import { remote } from 'electron';

import * as jiraActions from '../actions/jira';
import * as contextActions from '../actions/context';
import AuthForm from './AuthForm';
import Main from '../components/Main';


function mapStateToProps(state) {
  return {
    connected: state.get('jira').connected,
    currentProject: state.get('context').currentProject,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...jiraActions, ...contextActions }, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {
  static propTypes = {
    connected: PropTypes.bool.isRequired,
    currentProject: PropTypes.object.isRequired,
    fetchProjects: PropTypes.func.isRequired,
    fetchIssues: PropTypes.func.isRequired,
    fetchSettings: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    const { getGlobal } = remote;
    const appDir = getGlobal('appDir');
    fs.access(`${appDir}/screenshots/`, fs.constants.R_OK | fs.constants.W_OK, (err) => {
      if (err) {
        fs.mkdir(`${appDir}/screenshots/`);
      }
    });
    fs.access(`${appDir}/worklogs/`, fs.constants.R_OK | fs.constants.W_OK, (err) => {
      if (err) {
        fs.mkdir(`${appDir}/worklogs/`);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.connected && nextProps.connected) {
      this.props.fetchProjects()
        .then(
          () => this.props.fetchSettings(),
        );
    }
    if (!this.props.currentProject.equals(nextProps.currentProject)) {
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
