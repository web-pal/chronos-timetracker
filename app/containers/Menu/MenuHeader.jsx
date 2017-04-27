import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { remote } from 'electron';

import Flex from '../../components/Base/Flex/Flex';
import Avatar from '../../components/Avatar/Avatar';
import ProjectPicker from './ProjectPicker';

import cameraIcon from '../../assets/images/camera@2x.png';
import nocameraIcon from '../../assets/images/camera-crossed-out@2x.png';
import logoutIcon from '../../assets/images/logout@2x.png';

import * as profileActions from '../../actions/profile';
import * as uiActions from '../../actions/ui';

const cogIcon = require('../../assets/images/cog.png');

const MenuHeader = ({
  userData,
  settings,
  logout,
  setShowSettingsModal,
}) => {
  const screenshotsEnabled = settings.get('screenshotsEnabled');
  const screenshotsEnabledUsers = settings.get('screenshotsEnabledUsers');

  const selfKey = userData.get('key');
  const cond1 = screenshotsEnabled === 'everyone';
  const cond2 = screenshotsEnabled === 'forUsers' &&
    screenshotsEnabledUsers.includes(selfKey);
  const cond3 = screenshotsEnabled === 'excludingUsers' &&
    !screenshotsEnabledUsers.includes(selfKey);

  const willMakeScreenshots = cond1 || cond2 || cond3;
  return (
    <Flex className="HeaderWrapper">
      <Flex column className="header">
        <Flex row>
          <Avatar avatarUrls={userData.get('avatarUrls')} />
          <Flex column centered>
            <span className="username">
              {userData.get('displayName')}
            </span>
          </Flex>
          <Flex row className="header__icons flex-item--end">
            <a
              className="CameraIcon"
              title={`screenshots ${willMakeScreenshots ? 'enabled' : 'disabled'}`}
            >
              <img
                src={willMakeScreenshots ? cameraIcon : nocameraIcon}
                width={20}
                height={willMakeScreenshots ? 16 : 19}
                alt="{camera}"
              />
            </a>
            <a
              onClick={() => setShowSettingsModal(true)}
              className="cogIcon"
            >
              <img
                src={cogIcon}
                alt="{cog}"
              />
            </a>
            <a
              className="flex-item--end logout"
              title="logout"
              onClick={() => {
                const { getGlobal } = remote;
                const { running, uploading } = getGlobal('sharedObj');
                if (running) {
                  window.alert('Tracking in progress, save worklog before logout!');
                }
                if (uploading) {
                  window.alert('Currently app in process of saving worklog, wait few seconds please');
                }
                if (!running && !uploading) {
                  logout();
                }
              }}
            >
              <img
                src={logoutIcon}
                width={13}
                height={14}
                alt="logoutIcon"
              />
            </a>
          </Flex>
        </Flex>
        <ProjectPicker />
      </Flex>
    </Flex>
  );
};

MenuHeader.propTypes = {
  userData: ImmutablePropTypes.map.isRequired,
  settings: ImmutablePropTypes.record.isRequired,
  setShowSettingsModal: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

function mapStateToProps({ settings, profile }) {
  return {
    userData: profile.userData,
    settings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...profileActions, ...uiActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuHeader);
