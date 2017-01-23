import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Flex from '../components/Base/Flex/Flex';
import Header from '../components/Header/Header';

import { getProjects, getSelectedProject } from '../selectors/';

import * as jiraActions from '../actions/jira';
import * as projectsActions from '../actions/projects';
import * as settingsActions from '../actions/settings';

const HeaderWrapper = ({
  self,
  projects,
  fetching,
  settings,
  currentProject,
  logout,
  selectProject,
}) => {
  const { screenshotsEnabled, screenshotsEnabledUsers } = settings.toJS();
  const selfKey = self.get('key');
  const cond1 = screenshotsEnabled === 'everyone';
  const cond2 = screenshotsEnabled === 'forUsers' &&
    screenshotsEnabledUsers.includes(selfKey);
  const cond3 = screenshotsEnabled === 'excludingUsers' &&
    !screenshotsEnabledUsers.includes(selfKey);
  return (
    <Flex className="HeaderWrapper">
      <Header
        avatarUrl={self.getIn(['avatarUrls', '32x32'])}
        username={self.get('displayName')}
        projects={projects}
        fetching={fetching}
        screenshotsEnabled={cond1 || cond2 || cond3}
        currentProject={currentProject}
        onProjectChange={selectProject}
        logout={logout}
      />
    </Flex>
  );
};

HeaderWrapper.propTypes = {
  self: PropTypes.object.isRequired,
  projects: PropTypes.object.isRequired,
  fetching: PropTypes.string,
  settings: PropTypes.object.isRequired,
  currentProject: PropTypes.object.isRequired,
  selectProject: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

function mapStateToProps({ jira, settings, projects }) {
  return {
    self: jira.self,
    settings,
    projects: getProjects({ projects }),
    currentProject: getSelectedProject({ projects }),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...jiraActions,
    ...settingsActions,
    ...projectsActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderWrapper);
