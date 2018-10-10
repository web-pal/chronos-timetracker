// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';
import {
  shell,
} from 'electron';
import {
  getStatus as getResourceStatus,
} from 'redux-resource';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';
import type {
  Connector,
} from 'react-redux';
import Tag from '@atlaskit/tag';
import type {
  User,
  Dispatch,
} from 'types';

import Lozenge from '@atlaskit/lozenge';

import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';

import {
  authActions,
  uiActions,
  settingsActions,
  issuesActions,
} from 'actions';
import {
  getUserData,
  getUiState,
} from 'selectors';
import {
  cogIcon,
  refreshWhite,
} from 'utils/data/svg';
import config from 'config';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import EditorAddIcon from '@atlaskit/icon/glyph/editor/add';

import { transformValidHost } from 'sagas/auth';

import FeatureHighlight from 'components/FeatureHighlight';

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


type Props = {
  userData: User,
  accounts: Array<{|
    name: string,
    origin: string,
  |}>,
  host: string,
  updateAvailable: string,
  updateFetching: boolean,
  issuesFetching: boolean,
  dispatch: Dispatch,
};

const Header: StatelessFunctionalComponent<Props> = ({
  userData,
  accounts,
  host,
  updateAvailable,
  updateFetching,
  issuesFetching,
  dispatch,
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
        <FeatureHighlight
          id="multiAccounts"
          description="You can switch between your accounts here."
        >
          <DropdownMenu
            triggerType="default"
            position="right top"
            trigger={
              <ProfileTeam>
                {host} <ChevronDownIcon />
              </ProfileTeam>
            }
          >
            {accounts.map((ac) => {
              const acHost = transformValidHost(ac.origin);
              const isActive = acHost.host === host &&
                (ac.name === userData.emailAddress ||
                  ac.name === userData.key ||
                  ac.name === userData.name);
              return (
                <DropdownItem
                  key={`${ac.origin}:${ac.name}`}
                  onClick={() => dispatch(authActions.switchAccount(ac))}
                  isDisabled={isActive}
                  elemAfter={isActive && <Lozenge appearance="success">Active</Lozenge>}
                >
                  <Tag text={acHost.hostname} color="teal" />
                  {ac.name}
                </DropdownItem>
              );
            })}
            <DropdownItem
              onClick={() => dispatch(authActions.logoutRequest({ dontForget: true }))}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <EditorAddIcon /> Add account
              </span>
            </DropdownItem>
          </DropdownMenu>
        </FeatureHighlight>
      </ProfileInfo>
    </ProfileContainer>

    <IconsContainer>
      <RefreshIcon
        src={refreshWhite}
        onClick={() => {
          if (!issuesFetching) {
            dispatch(issuesActions.refetchIssuesRequest());
          }
        }}
        alt="Refresh"
      />
      {updateAvailable &&
        <UpdateAvailableBadge />
      }
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
          <DropdownItem
            onClick={() => {
              dispatch(uiActions.setModalState('settings', true));
            }}
          >
            Settings
          </DropdownItem>
          <DropdownItem
            onClick={() => shell.openExternal(config.supportLink)}
          >
            Support and feedback
          </DropdownItem>
          <DropdownItem
            onClick={() => shell.openExternal(config.githubLink)}
          >
            Github
          </DropdownItem>
          <DropdownSeparator />

          {updateAvailable && !updateFetching && [
            <DropdownUpdateItem
              onClick={() => {
                dispatch(uiActions.setModalState('settings', true));
                dispatch(settingsActions.setSettingsModalTab('Updates'));
              }}
            >
              {updateAvailable} is out! Update now.
            </DropdownUpdateItem>,
            <DropdownSeparator />,
          ]}

          <DropdownLogoutItem
            onClick={() => {
              dispatch(authActions.logoutRequest());
            }}
          >
            Logout
          </DropdownLogoutItem>
        </DropdownItemGroup>
      </DropdownMenu>
    </IconsContainer>
  </HeaderContainer>;


function mapStateToProps(state) {
  const sidebarType = getUiState('sidebarType')(state);
  const request = sidebarType === 'recent' ? 'recentIssues' : 'filterIssues';
  return {
    userData: getUserData(state),
    host: getUiState('host')(state),
    accounts: getUiState('accounts')(state),
    updateAvailable: getUiState('updateAvailable')(state),
    updateFetching: getUiState('updateFetching')(state),
    issuesFetching: getResourceStatus(
      state,
      `issues.requests.${request}.status`,
    ).pending,
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(Header);
