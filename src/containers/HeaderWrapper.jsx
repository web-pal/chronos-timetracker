import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Flex from '../components/Base/Flex/Flex';
import Header from '../components/Header/Header';

import * as contextActions from '../actions/context';
import * as jiraActions from '../actions/jira';

const HeaderWrapper = ({
  self,
  projects,
  fetching,
  settings,
  currentProject,
  logout,
  setCurrentProject,
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
        avatarUrl={self.getIn(['avatars', '32x32'])}
        username={self.get('displayName')}
        projects={projects}
        fetching={fetching}
        screenshotsEnabled={cond1 || cond2 || cond3}
        currentProject={currentProject}
        onProjectChange={setCurrentProject}
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
  setCurrentProject: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

function mapStateToProps({ jira, context }) {
  return {
    self: jira.self,
    projects: context.projects,
    fetching: context.fetching,
    currentProject: context.currentProject,
    settings: context.settings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...contextActions, ...jiraActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderWrapper);
