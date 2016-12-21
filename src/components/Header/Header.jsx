import React, { PropTypes } from 'react';

import Avatar from '../Avatar/Avatar';
import Dropdown from '../Dropdown/Dropdown';
import Flex from '../Base/Flex/Flex';

const Header = (props) => {
  const {
    avatarUrl,
    username,
    projects,
    fetching,
    currentProject,
    currentProjectId,
    onProjectChange,
    logout,
    screenshotsEnabled,
  } = props;
  const dropdownOptions = [];
  for (const entry of projects.entries()) {
    const [i, project] = entry;
    dropdownOptions.push({
      value: i,
      label: project.get('name'),
    });
  }
  const value =
    currentProjectId !== null ? {
      value: currentProjectId,
      label: currentProject.get('name'),
    } : undefined;

  return (
    <Flex column className="header">
      <Flex row>
        <Avatar avatarUrl={avatarUrl} />
        <Flex column centered>
          <span className="username">
            {username}
          </span>
          <a title={`screenshots ${screenshotsEnabled ? 'enabled' : 'disabled'}`}>
            <span
              className={`fa fa-camera ${screenshotsEnabled ? 'enabled' : 'disabled'}`}
            />
            {!screenshotsEnabled &&
              <span className="intersect" />
            }
          </a>
          <a title="logout">
            <span
              className="fa fa-sign-out" onClick={logout}
            />
          </a>
        </Flex>
      </Flex>
      <Dropdown
        options={dropdownOptions}
        onChange={onProjectChange}
        value={value}
        fetching={fetching}
      />
    </Flex>
  );
};

Header.propTypes = {
  avatarUrl: PropTypes.string.isRequired,
  screenshotsEnabled: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  projects: PropTypes.object,
  fetchin: PropTypes.string,
  currentProject: PropTypes.object,
  currentProjectId: PropTypes.number,
  onProjectChange: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

export default Header;
