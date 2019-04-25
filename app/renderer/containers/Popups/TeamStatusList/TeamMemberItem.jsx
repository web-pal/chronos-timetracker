// @flow
import React from 'react';

import * as S from './styled';

type Props = {
  name: string,
  timeZone: string,
  lastDate: Date,
  avatarUrls: {
    '16x16': string,
    '32x32': string,
    '48x48': string,
  },
  timezonesOptions: Array<{
    label: string,
    value: string,
  }>,
  updateTimezone: () => void,
};

const TeamMemberItem = ({
  name,
  timeZone,
  lastDate,
  avatarUrls,
  timezonesOptions,
  updateTimezone,
}: Props) => (
  <S.TeamMemberItemWrapper>
    <S.UserAvatar
      src={avatarUrls['48x48']}
      alt="User avatar"
    />
    <S.UserInfoWrapper>
      <S.UserName>{name}</S.UserName>
      <S.UserTimezoneWrapper>
        <S.UserTimezone>{timeZone}</S.UserTimezone>
        <S.TimezonePicker
          fieldId="timezonePicker"
          options={timezonesOptions}
          placeholder="Choose a timezone"
          onChange={updateTimezone}
          target={({ ref }) => (
            <span
              ref={ref}
            >
              <S.EditIcon
                size="small"
              />
            </span>
          )}
          popperProps={{ placement: 'bottom', positionFixed: true }}
          searchThreshold={10}
        />
      </S.UserTimezoneWrapper>
    </S.UserInfoWrapper>
    <S.LastDate>{lastDate}</S.LastDate>
  </S.TeamMemberItemWrapper>
);

export default TeamMemberItem;
