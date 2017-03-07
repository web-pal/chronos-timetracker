import React, { PropTypes } from 'react';

import Avatar from '../Avatar/Avatar';
import ProjectPickerWrapper from '../../containers/ProjectPickerWrapper';
import Flex from '../Base/Flex/Flex';

import cameraIcon from '../../assets/images/camera.png';
import logoutIcon from '../../assets/images/logout.png';

const Header = ({ avatarUrls, username, logout, screenshotsEnabled }) =>
  <Flex column className="header">
    <Flex row>
      <Avatar avatarUrls={avatarUrls} />
      <Flex column centered>
        <span className="username">
          {username}
        </span>
      </Flex>
      <Flex row className="header__icons flex-item--end">
        <a
          className="CameraIcon"
          title={`screenshots ${screenshotsEnabled ? 'enabled' : 'disabled'}`}
        >
          <img
            src={cameraIcon}
          />
        </a>
        <a
          className="flex-item--end logout"
          title="logout"
        >
          <img
            src={logoutIcon}
            onClick={logout}
          />
        </a>
      </Flex>
    </Flex>
    <ProjectPickerWrapper />
  </Flex>;

Header.propTypes = {
  avatarUrls: PropTypes.object,
  screenshotsEnabled: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  logout: PropTypes.func.isRequired,
};

export default Header;
