/* global mixpanel */
// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DropdownMenu, { DropdownItemGroup, DropdownItem } from '@atlaskit/dropdown-menu';
import { cogIcon } from 'data/svg';
import { Flex } from 'components';
import { profileActions, uiActions, settingsActions } from 'actions';
import { shell } from 'electron';
import {
  getUserData,
  getHost,
  getUpdateAvailable,
  getUpdateCheckRunning,
  getUpdateFetching,
} from 'selectors';

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
  UpdateInfo,
  InstallUpdateRequest,
  SetSettingsModalOpen,
  SetAboutModalOpen,
  SetSupportModalOpen,
  SetSettingsModalTab,
} from '../../types';

type Props = {
  userData: User,
  host: string,
  updateCheckRunning: boolean,
  updateAvailable: UpdateInfo,
  updateFetching: boolean,

  logoutRequest: LogoutRequest,
  installUpdateRequest: InstallUpdateRequest,
  setSettingsModalOpen: SetSettingsModalOpen,
  setSupportModalOpen: SetSupportModalOpen,
  setSettingsModalTab: SetSettingsModalTab,
  setAboutModalOpen: SetAboutModalOpen,
};

const Header: StatelessFunctionalComponent<Props> = ({
  userData,
  host,
  updateCheckRunning,
  updateAvailable,
  updateFetching,
  logoutRequest,
  installUpdateRequest,
  setSettingsModalOpen,
  setSettingsModalTab,
  // setSupportModalOpen,
  setAboutModalOpen,
}: Props): Node =>
  <HeaderContainer className="webkit-drag">
    <Flex row alignCenter>
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
          <DropdownItem
            onClick={() => {
              mixpanel.track('Opened Settings');
              setSettingsModalOpen(true);
            }}
          >
            Settings
          </DropdownItem>
          <DropdownItem
            onClick={() =>
              shell.openExternal('https://web-pal.atlassian.net/servicedesk/customer/portal/2')
            }
          >
            Support and feedback
          </DropdownItem>
          {/*
          <DropdownItem onClick={() => setSupportModalOpen(true)}>
            Support and feedback
          </DropdownItem>
          */}
          {/* TODO: use link to the landing when it's there
            <DropdownItem onClick={() => setAboutModalOpen(true)}>
              About
            </DropdownItem>
          */}
          <DropdownSeparator />
          {updateAvailable && !updateFetching && [
            <DropdownUpdateItem
              onClick={() => {
                mixpanel.track('Clicked "Install Update"', { upcomingVersion: updateAvailable });
                setSettingsModalOpen(true);
                setSettingsModalTab('Updates');
              }}
            >
              {updateAvailable} is out! Update now.
            </DropdownUpdateItem>,
            <DropdownSeparator />,
          ]}
          <DropdownLogoutItem onClick={logoutRequest}>
            Logout
          </DropdownLogoutItem>
        </DropdownItemGroup>
      </DropdownMenu>
    </Flex>
  </HeaderContainer>;

function mapStateToProps(state) {
  return {
    userData: getUserData(state),
    host: getHost(state),
    updateCheckRunning: getUpdateCheckRunning(state),
    updateAvailable: getUpdateAvailable(state),
    updateFetching: getUpdateFetching(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...profileActions, ...uiActions, ...settingsActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
