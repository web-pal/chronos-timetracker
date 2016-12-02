import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as contextActions from '../actions/context';
import Flex from '../components/Base/Flex/Flex';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';

function mapStateToProps(state) {
  return {
    self: state.get('jira').self,
    projects: state.get('context').projects,
    currentProject: state.get('context').currentProject,
    currentProjectId: state.get('context').currentProjectId,
    issues: state.get('context').issues,
    currentIssueId: state.get('context').currentIssueId,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(contextActions, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Menu extends Component {
  static propTypes = {
    self: PropTypes.object.isRequired,
    projects: PropTypes.object.isRequired,
    currentProject: PropTypes.object,
    currentProjectId: PropTypes.number,
    issues: PropTypes.object.isRequired,
    currentIssueId: PropTypes.number,
    setCurrentProject: PropTypes.func.isRequired,
    setCurrentIssue: PropTypes.func.isRequired,
  }

  handleProjectChange = (entry) => {
    this.props.setCurrentProject(entry.value);
  }

  handleIssueClick = (issueId) => {
    this.props.setCurrentIssue(issueId);
  }

  render() {
    const { self, projects, currentProject, currentProjectId, issues, currentIssueId } = this.props;
    return (
      <Flex column className="menu">
        <Header
          avatarUrl={self && self.get('avatarUrls').get('32x32')}
          username={self && self.get('displayName')}
          projects={projects}
          currentProject={currentProject}
          onProjectChange={this.handleProjectChange}
        />
        <Sidebar
          items={issues}
          currentProjectId={currentProjectId}
          current={currentIssueId}
          onItemClick={this.handleIssueClick}
        />
      </Flex>
    );
  }
}

