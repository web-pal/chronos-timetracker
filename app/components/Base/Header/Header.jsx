import React from 'react';

import { avatarIcon, cogIcon } from 'data/svg';
import Flex from '../../../components/Base/Flex/Flex';
// import Flex from '@components/Base/Flex/Flex';
import {
  Header,
  Name,
  ProfileInfo,
  SettingsIcon,
  ProfilePicture,
  Team,
} from './styled';

const name = 'Maxim Ignatev';
const team = 'web-pal.atlassian.com';

export default () => (
  <Header>
    <Flex row alignCenter>
      <ProfilePicture src={avatarIcon} alt="" />
      <ProfileInfo>
        <Name>{name}</Name>
        <Team>{team}</Team>
      </ProfileInfo>
    </Flex>
    <SettingsIcon src={cogIcon} alt="" />
  </Header>
);
