import React, { PropTypes, Component } from 'react';
import fs from 'fs';
import rimraf from 'rimraf';
import { remote } from 'electron';
import { normalize, schema } from 'normalizr';
import { issueSchema } from '../schemas/issue';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getSelectedProjectId } from '../selectors/';

import * as issuesActions from '../actions/issues';
import * as worklogsActions from '../actions/worklogs';
import * as projectsActions from '../actions/projects';
import * as jiraActions from '../actions/jira';
import * as trackerActions from '../actions/tracker';
import * as uiActions from '../actions/ui';

class FetchWrapper extends Component {
  static propTypes = {
    filterValue: PropTypes.string,
    searchIssues: PropTypes.func.isRequired,
    children: PropTypes.node,
    connected: PropTypes.bool.isRequired,
    online: PropTypes.bool.isRequired,
    currentProject: PropTypes.string,
    fetchProjects: PropTypes.func.isRequired,
    fetchIssues: PropTypes.func.isRequired,
    fetchLastWeekLoggedIssues: PropTypes.func.isRequired,
    getLastProject: PropTypes.func.isRequired,
    checkCurrentOfflineWorklogs: PropTypes.func.isRequired,
    checkCurrentOfflineScreenshots: PropTypes.func.isRequired
  };

  componentWillReceiveProps(nextProps) {
    const {
      fetchLastWeekLoggedIssues,
      fetchIssues,
      clearIssues,
      clearWorklogs,
      checkCurrentOfflineWorklogs,
      checkCurrentOfflineScreenshots,
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
      fs.access(`${appDir}/screens/`, fs.constants.R_OK | fs.constants.W_OK, (err) => {
        if (err) {
          fs.mkdirSync(`${appDir}/screens/`);
        }
      });
      // Remove legacy dir, after few versions we will remove this code (0.0.9)
      fs.access(`${appDir}/screenshots/`, fs.constants.R_OK | fs.constants.W_OK, (err) => {
        if (!err) {
          rimraf(`${appDir}/screenshots/`, () => console.log('removed old screenshots'));
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
    if (!this.props.online && nextProps.online) {
      checkCurrentOfflineWorklogs();
      checkCurrentOfflineScreenshots();
    }
  }

  initialize = () => {
    const {
      fetchProjects,
      getLastProject,
      checkConnection,
    } = this.props;

    fetchProjects()
      .then(
        () =>  getLastProject()
      )
    checkConnection();
    this.checkConnectionInterval = setInterval(() => checkConnection(), 10000);
  }

  componentWillUnmount() {
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
    online: jira.online,
    currentProject: getSelectedProjectId({ projects }),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...jiraActions,
    ...trackerActions,
    ...issuesActions,
    ...worklogsActions,
    ...projectsActions,
    ...uiActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FetchWrapper);
