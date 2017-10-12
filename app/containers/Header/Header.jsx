// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
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

const Header: StatelessFunctionalComponent<Props> = ({
  userData,
  host,
  logoutRequest,
  setSettingsModalOpen,
  setSupportModalOpen,
  setAboutModalOpen,
}: Props): Node =>
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
      {true &&
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
          {true &&
            <DropdownSeparator />
          }
          {true &&
            <DropdownUpdateItem onClick={() => alert('TODO: start update')}>
              Update available. Restart now
            </DropdownUpdateItem>
          }
          <DropdownSeparator />
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
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...profileActions, ...uiActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
