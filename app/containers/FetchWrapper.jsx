import React, { PropTypes, Component } from 'react';
import fs from 'fs';
import { remote } from 'electron';

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
    installUpdate: PropTypes.bool.isRequired,
    setUpdateFetchState: PropTypes.func.isRequired,
    notifyUpdateAvailable: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.updater = remote.require('electron-simple-updater');

    this.updater.on('cheking-for-update', () => {
      this.props.setUpdateFetchState(true);
    });

    this.updater.on('update-available', (meta) => {
      this.props.setUpdateFetchState(false);
      this.props.notifyUpdateAvailable(meta);
    });

    this.updater.on('update-downloading', () => {
      this.props.setUpdateDownloadState(true);
    });

    this.updater.on('update-downloaded', () => {
      this.props.setUpdateDownloadState(false);
      if(window.confirm('App updated, restart now?')) {
        this.updater.quitAndInstall();
      }
    });

    this.updater.checkForUpdates();
  }

  componentWillReceiveProps(nextProps) {
    const currentFilterValue = this.props.filterValue;
    const nextFilterValue = nextProps.filterValue;

    const currentConnected = this.props.connected;
    const nextConnected = nextProps.connected;
    
    const installUpdate = this.props.installUpdate;
    const nextInstallUpdate = nextProps.installUpdate;

    if(installUpdate !== nextInstallUpdate && nextInstallUpdate) {
      this.updater.downloadUpdate();
    }

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
      this.props.fetchProjects()
        .then(
          () => {
            this.props.getLastProject();
            this.props.fetchSettings();
          },
        );
    }
    if (this.props.currentProject !== nextProps.currentProject) {
      if (this.props.currentProject) {
        this.props.clearIssues();
        this.props.clearWorklogs();
      }
      this.props.fetchLastWeekLoggedIssues()
        .catch(
          (e) => console.log(e)
        );
      this.props.fetchIssues({ startIndex: 0, stopIndex: -1 }, true)
        .catch(
          (e) => console.log(e)
        )
    }
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
    installUpdate: jira.installUpdate,
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
