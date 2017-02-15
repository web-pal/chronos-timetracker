import React, { PropTypes, Component } from 'react';
import fs from 'fs';
import { remote } from 'electron';
import { normalize, schema } from 'normalizr';
import { issueSchema } from '../schemas/issue';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getSelectedProjectId } from '../selectors/';

import * as issuesActions from '../actions/issues';
import * as worklogsActions from '../actions/worklogs';
import * as projectsActions from '../actions/projects';
import * as settingsActions from '../actions/settings';
import * as jiraActions from '../actions/jira';
import * as uiActions from '../actions/ui';

class FetchWrapper extends Component {
  static propTypes = {
    filterValue: PropTypes.string,
    searchIssues: PropTypes.func.isRequired,
    children: PropTypes.node,
    connected: PropTypes.bool.isRequired,
    currentProject: PropTypes.string,
    fetchProjects: PropTypes.func.isRequired,
    fetchIssues: PropTypes.func.isRequired,
    fetchSettings: PropTypes.func.isRequired,
    fetchLastWeekLoggedIssues: PropTypes.func.isRequired,
    getLastProject: PropTypes.func.isRequired,
  };

  componentWillReceiveProps(nextProps) {
    const {
      fetchProjectStatuses,
      fetchLastWeekLoggedIssues,
      fetchIssues,
      clearIssues,
      clearWorklogs,
    } = this.props;

    const currentFilterValue = this.props.filterValue;
    const nextFilterValue = nextProps.filterValue;

    const currentConnected = this.props.connected;
    const nextConnected = nextProps.connected;
    
    if (currentFilterValue !== nextFilterValue) {
      this.props.searchIssues(nextFilterValue);
    }

    if (!currentConnected && nextConnected) {
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
      this.initialize();
    }
    if (this.props.currentProject !== nextProps.currentProject) {
      if (this.props.currentProject) {
        clearIssues();
        clearWorklogs();
      }
      fetchLastWeekLoggedIssues();
      fetchIssues();
    }
  }

  initialize = () => {
    const {
      fetchProjects,
      getLastProject,
      fetchSettings,
      checkConnection,
    } = this.props;

    fetchProjects()
      .then(
        () =>  getLastProject()
      )
      .then(
        () => fetchSettings()
      )
    checkConnection();
    this.checkConnectionInterval = setInterval(() => checkConnection, 10000);
  }

  componentWillMount() {
    clearInterval(this.checkConnectionInterval);
  }

  render() {
    return (
      <div className="FetchWrapper wrapper">
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps({ filter, jira, projects }) {
  return {
    filterValue: filter.value,
    connected: jira.connected,
    currentProject: getSelectedProjectId({ projects }),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...jiraActions,
    ...issuesActions,
    ...worklogsActions,
    ...projectsActions,
    ...settingsActions,
    ...uiActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FetchWrapper);
