import React from 'react';
import moment from 'moment';
import {
  hot,
} from 'react-hot-loader/root';

import {
  connect,
} from 'react-redux';

import type {
  Connector,
} from 'react-redux';

import {
  getUiState,
} from 'selectors';

import TeamMemberItem from './TeamMemberItem';

import * as S from './styled';

const mockTeamName = 'Web-Pal';

type Props = {
  users: {
    accountId: string,
    displayName: string,
    timeZone: string,
    avatarUrls: {
      '16x16': string,
      '32x32': string,
      '48x48': string,
    }
  },
};

const TeamStatusList = ({ users }:Props) => (
  <S.TeamStatusListWrapper>
    <S.TeamMembersWrapper>
      {users && users.length > 0 ? users.map(({
        accountId,
        displayName,
        timeZone,
        avatarUrls,
      }) => (
        <TeamMemberItem
          key={accountId}
          name={displayName}
          timeZone={timeZone}
          status="Working"
          lastDate={moment().format('ddd LT')}
          emoji="💼"
          avatarUrls={avatarUrls}
        />
      )) : (
        <S.NoTeamSelectedText>
          Please select your team in chronos settings
        </S.NoTeamSelectedText>
      )}
    </S.TeamMembersWrapper>
    <S.FooterToolbar>
      <S.EditIcon />
      <S.TeamName>
        {`💼 ${mockTeamName}`}
      </S.TeamName>
      <S.SettingsIcon />
    </S.FooterToolbar>
  </S.TeamStatusListWrapper>
);

function mapStateToProps(state) {
  return {
    users: getUiState('usersInTeamStatusWindow')(state),
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default hot(connector(TeamStatusList));
