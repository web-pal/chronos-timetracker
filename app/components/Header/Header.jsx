import React, { PropTypes } from 'react';

import Avatar from '../Avatar/Avatar';
import ProjectPickerWrapper from '../../containers/ProjectPickerWrapper';
import Flex from '../Base/Flex/Flex';

import cameraIcon from '../../assets/images/camera@2x.png';
import logoutIcon from '../../assets/images/logout@2x.png';

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
            width={20}
            height={16}
          />
        </a>
        <a
          className="flex-item--end logout"
          title="logout"
          onClick={logout}
        >
          <img
            src={logoutIcon}
            width={13}
            height={14}
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
