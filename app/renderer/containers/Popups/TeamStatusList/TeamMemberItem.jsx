// @flow
import React from 'react';
import * as S from './styled';

type Props = {
  name: string,
  timeZone: string,
  status: string,
  lastDate: Date,
  emoji: string,
  avatarUrls: {
    '16x16': string,
    '32x32': string,
    '48x48': string,
  },
};

const TeamMemberItem = ({
  name,
  timeZone,
  status,
  lastDate,
  emoji,
  avatarUrls,
}: Props) => (
  <S.TeamMemberItemWrapper>
    <S.UserAvatar
      src={avatarUrls['48x48']}
      alt="User avatar"
    />
    <S.UserInfoWrapper>
      <S.UserName>{name}</S.UserName>
      <S.UserLocation>{timeZone}</S.UserLocation>
      <S.Status>{`${emoji} ${status}`}</S.Status>
    </S.UserInfoWrapper>
    <S.LastDate>{lastDate}</S.LastDate>
  </S.TeamMemberItemWrapper>
);

export default TeamMemberItem;
