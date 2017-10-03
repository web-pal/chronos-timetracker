// @flow
import React, { Component } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DropdownMenu, { DropdownItemGroup, DropdownItem } from '@atlaskit/dropdown-menu';
import { cogIcon } from 'data/svg';
import { Flex } from 'components';
import { profileActions, uiActions } from 'actions';
import { getUserData, getHost } from 'selectors';

import {
  HeaderContainer,
  Name,
  ProfileInfo,
  SettingsIcon,
  ProfilePicture,
  Team,
  DropdownSeparator,
  UpdateAvailableBadge,
  DropdownLogoutItem,
  DropdownUpdateItem,
} from './styled';

import type {
  LogoutRequest,
  User,
  SetSettingsModalOpen,
  SetAboutModalOpen,
  SetSupportModalOpen,
} from '../../types';

type Props = {
  userData: User,
  host: string,

  logoutRequest: LogoutRequest,
  setSettingsModalOpen: SetSettingsModalOpen,
  setSupportModalOpen: SetSupportModalOpen,
  setAboutModalOpen: SetAboutModalOpen,
};

class Header extends Component<Props> {
  onLogout = () => {
    const { logoutRequest } = this.props;
    const { getGlobal } = remote;
    const { running, uploading } = getGlobal('sharedObj');

    if (running) {
      // eslint-disable-next-line no-alert
      window.alert('Tracking in progress, save worklog before logout!');
    }
    if (uploading) {
      // eslint-disable-next-line no-alert
      window.alert('Currently app in process of saving worklog, wait few seconds please');
    }
    if (!running && !uploading) {
      logoutRequest();
    }
  }

  openModal = (modalName) => () => {
    this.props[`setShow${modalName}Modal`](true);
  }

  render() {
    const {
      userData,
      host,
      setSettingsModalOpen,
      setSupportModalOpen,
      setAboutModalOpen,
    } = this.props;
    // TODO: update available
    const updateAvailable = true;

    return (
      <HeaderContainer className="webkit-drag">
        <Flex row alignCenter>
          {/*
            <ProfilePicture src={avatarIcon} alt="" />
          */}
          <ProfilePicture src={userData.avatarUrls['48x48']} alt="" />
          <ProfileInfo>
            <Name>{userData.displayName}</Name>
            <Team>{host}</Team>
          </ProfileInfo>
        </Flex>
        <Flex row style={{ position: 'relative' }}>
          {updateAvailable &&
            <UpdateAvailableBadge />
          }
          <DropdownMenu
            trigger={<SettingsIcon src={cogIcon} alt="" />}
            triggerType="default"
            position="bottom right"
          >
            <DropdownItemGroup>
              <DropdownItem onClick={() => setSettingsModalOpen(true)}>
                Settings
              </DropdownItem>
              <DropdownItem onClick={() => setSupportModalOpen(true)}>
                Support and feedback
              </DropdownItem>
              <DropdownItem onClick={() => setAboutModalOpen(true)}>
                About
              </DropdownItem>
              {updateAvailable &&
                <DropdownSeparator />
              }
              {updateAvailable &&
              <DropdownUpdateItem onClick={() => alert('TODO: start update')}>
                Update available. Restart now
              </DropdownUpdateItem>
              }
              <DropdownSeparator />
              <DropdownLogoutItem onClick={this.onLogout}>
                Logout
              </DropdownLogoutItem>
            </DropdownItemGroup>
          </DropdownMenu>
        </Flex>
      </HeaderContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    userData: getUserData(state),
    host: getHost(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...profileActions, ...uiActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
