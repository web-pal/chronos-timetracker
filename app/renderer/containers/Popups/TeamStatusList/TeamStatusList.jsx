import React, {
  useState,
  useEffect,
} from 'react';
import {
  hot,
} from 'react-hot-loader/root';

import {
  DateTime,
} from 'luxon';

import {
  connect,
} from 'react-redux';

import type {
  Connector,
  Dispatch,
} from 'react-redux';

import {
  getTeamStatusUsers,
  getAllTimezonesOptions,
} from 'selectors';

import {
  usersActions,
} from 'actions';

import TeamMemberItem from './TeamMemberItem';

import * as S from './styled';

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
  dispatch: Dispatch,
  timezonesOptions: Array<{
    label: string,
    value: string,
  }>
};

const TeamStatusList = ({
  users,
  timezonesOptions,
  dispatch,
}:Props) => {
  const [lastDate, setLastDate] = useState(DateTime.local());
  useEffect(() => {
    const timerId = setInterval(() => {
      setLastDate(prevDate => prevDate.plus({ seconds: 1 }));
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);
  return (
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
            lastDate={lastDate.setZone(timeZone).toFormat('ccc t')}
            avatarUrls={avatarUrls}
            timezonesOptions={timezonesOptions}
            updateTimezone={({ value }) => dispatch(usersActions.updateUserTimezone({
              userId: accountId,
              timezone: value,
            }))}
          />
        )) : (
          <S.NoTeamSelectedText>
            Please select your team in chronos settings
          </S.NoTeamSelectedText>
        )}
      </S.TeamMembersWrapper>
    </S.TeamStatusListWrapper>
  );
};

function mapStateToProps(state) {
  return {
    users: getTeamStatusUsers(state),
    timezonesOptions: getAllTimezonesOptions(state),
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default hot(connector(TeamStatusList));
