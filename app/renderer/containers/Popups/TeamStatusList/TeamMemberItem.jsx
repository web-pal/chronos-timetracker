// @flow
import React from 'react';
import * as S from './styled';

type Props = {
  name: string,
  location: string,
  status: string,
  lastDate: Date,
  emoji: string,
};

const TeamMemberItem = ({
  name,
  location,
  status,
  lastDate,
  emoji,
}: Props) => {
  return (
    <S.TeamMemberItemWrapper>
      <S.UserAvatar size="large" />
      <S.UserInfoWrapper>
        <S.UserName>{name}</S.UserName>
        <S.UserLocation>{location}</S.UserLocation>
        <S.Status>{`${emoji} ${status}`}</S.Status>
      </S.UserInfoWrapper>
      <S.LastDate>{lastDate}</S.LastDate>
    </S.TeamMemberItemWrapper>
  );
};

export default TeamMemberItem;
