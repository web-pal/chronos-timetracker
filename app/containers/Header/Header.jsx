// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';
import {
  bindActionCreators,
} from 'redux';
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';
import {
  shell,
} from 'electron';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';


import {
  getStatus as getResourceStatus,
} from 'redux-resource';
import {
  profileActions,
  authActions,
  uiActions,
  settingsActions,
  issuesActions,
  resourcesActions,
} from 'actions';
import {
  getUserData,
  getHost,
  getUpdateAvailable,
  getUpdateFetching,
} from 'selectors';
import {
  cogIcon,
  refreshWhite,
} from 'data/svg';
import config from 'config';

import {
  HeaderContainer,
  ProfileContainer,
  IconsContainer,
  ProfileInfo,
  SettingsIcon,
  ProfilePicture,
  ProfileName,
  ProfileTeam,
  DropdownSeparator,
  UpdateAvailableBadge,
  DropdownLogoutItem,
  DropdownUpdateItem,
  RefreshIcon,
} from './styled';

import type {
  LogoutRequest,
  User,
  UpdateInfo,
  SetSettingsModalOpen,
  SetSettingsModalTab,
  FetchRecentIssuesRequest,
} from '../../types';


type Props = {
  userData: User,
  host: URL,
  updateAvailable: UpdateInfo,
  updateFetching: boolean,
  issuesFetching: boolean,

  fetchRecentIssuesRequest: FetchRecentIssuesRequest,

  logoutRequest: LogoutRequest,
  setSettingsModalOpen: SetSettingsModalOpen,
  setSettingsModalTab: SetSettingsModalTab,
};

const Header: StatelessFunctionalComponent<Props> = ({
  userData,
  host,
  updateAvailable,
  updateFetching,
  issuesFetching,
  logoutRequest,
  setSettingsModalOpen,
  setSettingsModalTab,
  setModalState,
  clearResourceList,
  setResourceMeta,
  refetchIssuesRequest,
}: Props): Node =>
  <HeaderContainer className="webkit-drag">
    <ProfileContainer>
      <ProfilePicture
        src={userData.avatarUrls['48x48']}
        alt="User avatar"
      />
      <ProfileInfo>
        <ProfileName>
          {userData.displayName}
        </ProfileName>
        <ProfileTeam>
          {host}
        </ProfileTeam>
      </ProfileInfo>
    </ProfileContainer>

    <IconsContainer>
      <RefreshIcon
        src={refreshWhite}
        onClick={() => {
          if (!issuesFetching) {
            refetchIssuesRequest();
          }
        }}
        alt="Refresh"
      />
      {updateAvailable && <UpdateAvailableBadge />}
      <DropdownMenu
        triggerType="default"
        position="bottom right"
        trigger={
          <SettingsIcon
            src={cogIcon}
            alt="Settings"
          />
        }
      >
        <DropdownItemGroup>
          <DropdownItem onClick={() => setModalState('settings', true)}>
            Settings
          </DropdownItem>
          <DropdownItem onClick={() => shell.openExternal(config.supportLink)}>
            Support and feedback
          </DropdownItem>
          <DropdownItem onClick={() => shell.openExternal(config.githubLink)}>
            Github
          </DropdownItem>
          <DropdownSeparator />

          {updateAvailable && !updateFetching && [
            <DropdownUpdateItem
              onClick={() => {
                setModalState('settings', true);
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
    </IconsContainer>
  </HeaderContainer>;


function mapStateToProps(state) {
  return {
    userData: getUserData(state),
    host: getHost(state),
    updateAvailable: getUpdateAvailable(state),
    issuesFetching: getResourceStatus(
      state,
      'issues.requests.filterIssues.status',
    ).pending,
    updateFetching: getUpdateFetching(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...profileActions,
    ...authActions,
    ...uiActions,
    ...settingsActions,
    ...issuesActions,
    ...resourcesActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
