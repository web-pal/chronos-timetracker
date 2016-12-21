import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as contextActions from '../actions/context';
import * as jiraActions from '../actions/jira';
import Flex from '../components/Base/Flex/Flex';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';

import { getFilteredIssues } from '../selectors/issues';

function mapStateToProps(state) {
  return {
    self: state.get('jira').self,
    projects: state.get('context').projects,
    currentProject: state.get('context').currentProject,
    currentProjectId: state.get('context').currentProjectId,
    issues: getFilteredIssues({ context: state.get('context') }),
    currentIssueId: state.get('context').currentIssueId,
    trackingIssue: state.get('tracker').trackingIssue,
    filterValue: state.get('context').filterValue,
    resolveFilter: state.get('context').resolveFilter,
    fetching: state.get('context').fetching,
    settings: state.get('context').settings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...contextActions, ...jiraActions }, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Menu extends Component {
  static propTypes = {
    self: PropTypes.object.isRequired,
    projects: PropTypes.object.isRequired,
    currentProject: PropTypes.object,
    currentProjectId: PropTypes.number,
    issues: PropTypes.object.isRequired,
    currentIssueId: PropTypes.string,
    trackingIssue: PropTypes.string,
    filterValue: PropTypes.string,
    resolveFilter: PropTypes.bool,
    fetching: PropTypes.string,
    settings: PropTypes.object.isRequired,
    changeFilter: PropTypes.func.isRequired,
    clearFilter: PropTypes.func.isRequired,
    setCurrentProject: PropTypes.func.isRequired,
    setCurrentIssue: PropTypes.func.isRequired,
    toggleResolveFilter: PropTypes.func.isRequired,
    fetchIssues: PropTypes.func.isRequired,
    fetchSettings: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
  }

  handleProjectChange = entry => this.props.setCurrentProject(entry.value);

  handleIssueClick = issueId => this.props.setCurrentIssue(issueId);

  render() {
    const {
      self, projects, currentProject, currentProjectId, issues,
      currentIssueId, trackingIssue, changeFilter, clearFilter,
      filterValue, resolveFilter, toggleResolveFilter, fetching,
      logout, fetchIssues, fetchSettings, settings,
    } = this.props;
    const { screenshotsEnabled, screenshotsEnabledUsers } = settings.toJS();
    const selfKey = self.get('key');
    const cond1 = screenshotsEnabled === 'everyone';
    const cond2 = screenshotsEnabled === 'forUsers' &&
      screenshotsEnabledUsers.includes(selfKey);
    const cond3 = screenshotsEnabled === 'excludingUsers' &&
      !screenshotsEnabledUsers.includes(selfKey);
    return (
      <Flex column className="menu">
        <Header
          avatarUrl={self && self.get('avatarUrls').get('32x32')}
          username={self && self.get('displayName')}
          projects={projects}
          fetching={fetching}
          screenshotsEnabled={cond1 || cond2 || cond3}
          currentProject={currentProject}
          onProjectChange={this.handleProjectChange}
          logout={logout}
        />
        <Sidebar
          items={issues}
          fetching={fetching}
          currentProjectId={currentProjectId}
          current={currentIssueId}
          tracking={trackingIssue}
          filterValue={filterValue}
          refreshIssues={() => {
            fetchIssues();
            fetchSettings();
          }}
          onFilterChange={changeFilter}
          onFilterClear={clearFilter}
          onItemClick={this.handleIssueClick}
          onResolveFilter={toggleResolveFilter}
          resolveFilter={resolveFilter}
        />
      </Flex>
    );
  }
}

