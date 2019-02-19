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

import * as S from './styled';


type Props = {
  userData: User,
  accounts: Array<{|
    name: string,
    hostname: string,
  |}>,
  hostname: string,
  updateAvailable: string,
  downloadUpdateProgress: boolean,
  issuesFetching: boolean,
  dispatch: Dispatch,
};

const Header: StatelessFunctionalComponent<Props> = ({
  userData,
  accounts,
  hostname,
  updateAvailable,
  downloadUpdateProgress,
  issuesFetching,
  dispatch,
}: Props): Node => (
  <S.Header className="webkit-drag">
    <S.Profile>
      <S.ProfilePicture
        src={userData.avatarUrls['48x48']}
        alt="User avatar"
      />
      <S.ProfileInfo>
        <S.ProfileName>
          {userData.displayName}
        </S.ProfileName>
        <DropdownMenu
          triggerType="default"
          position="right top"
          trigger={(
            <S.ProfileTeam>
              {hostname} <ChevronDownIcon />
            </S.ProfileTeam>
          )}
        >
          {accounts.map((ac) => {
            const isActive = ac.hostname === hostname && ac.name === userData.name;
            return (
              <DropdownItem
                key={`${ac.hostname}:${ac.name}`}
                onClick={() => dispatch(authActions.switchAccount(ac))}
                isDisabled={isActive}
                elemAfter={isActive && <Lozenge appearance="success">Active</Lozenge>}
              >
                <Tag text={ac.hostname} color="teal" />
                {ac.name}
              </DropdownItem>
            );
          })}
          <DropdownItem
            key="addAccount"
            onClick={() => dispatch(authActions.logoutRequest({ forget: false }))}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              <EditorAddIcon /> Add account
            </span>
          </DropdownItem>
        </DropdownMenu>
      </S.ProfileInfo>
    </S.Profile>

    <S.Icons>
      <S.RefreshIcon
        src={refreshWhite}
        onClick={() => {
          if (!issuesFetching) {
            dispatch(issuesActions.refetchIssuesRequest());
          }
        }}
        alt="Refresh"
      />
      {updateAvailable
        && <S.UpdateAvailableBadge />
      }
      <DropdownMenu
        triggerType="default"
        position="bottom right"
        trigger={(
          <S.SettingsIcon
            src={cogIcon}
            alt="Settings"
          />
        )}
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
          <S.DropdownSeparator />

          {updateAvailable && !downloadUpdateProgress && [
            <S.DropdownUpdateItem
              key="update"
              onClick={() => {
                dispatch(uiActions.setModalState('settings', true));
                dispatch(settingsActions.setSettingsModalTab('Updates'));
              }}
            >
              {updateAvailable} is out! Update now.
            </S.DropdownUpdateItem>,
            <S.DropdownSeparator key="separator" />,
          ]}

          <S.DropdownLogoutItem
            onClick={() => {
              dispatch(authActions.logoutRequest({
                forget: true,
              }));
            }}
          >
            Logout
          </S.DropdownLogoutItem>
        </DropdownItemGroup>
      </DropdownMenu>
    </S.Icons>
  </S.Header>
);


function mapStateToProps(state) {
  const sidebarType = getUiState('sidebarType')(state);
  const request = sidebarType === 'recent' ? 'recentIssues' : 'filterIssues';
  return {
    userData: getUserData(state),
    hostname: getUiState('hostname')(state),
    accounts: getUiState('accounts')(state),
    updateAvailable: getUiState('updateAvailable')(state),
    downloadUpdateProgress: getUiState('downloadUpdateProgress')(state),
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
