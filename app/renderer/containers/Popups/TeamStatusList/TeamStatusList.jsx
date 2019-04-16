import React from 'react';
import moment from 'moment';
import {
  hot,
} from 'react-hot-loader/root';

import TeamMemberItem from './TeamMemberItem';

import * as S from './styled';

const mockTeamName = 'Web-Pal';

const mockTeamData = [{
  id: 1,
  name: 'Dinuka',
  location: 'Asia/Kuala_Lumpur',
  status: 'Taking a break',
  emoji: '🍹',
  lastDate: moment().format('ddd LT'),
},
{
  id: 2,
  name: 'James Bond',
  location: 'Europe/London',
  status: 'Just chilling',
  emoji: '🍸',
  lastDate: moment().format('ddd LT'),
},
{
  id: 3,
  name: 'George',
  location: 'Europe/Kyiv',
  status: 'Working',
  emoji: '💼',
  lastDate: moment().format('ddd LT'),
},
{
  id: 4,
  name: 'Henry Rollins',
  location: 'United_States/Chicago',
  status: 'Working from home',
  emoji: '🏠',
  lastDate: moment().format('ddd LT'),
},
{
  id: 5,
  name: 'Ozzy Osbourne',
  location: 'Europe/Kyiv',
  status: 'Working',
  emoji: '💼',
  lastDate: moment().format('ddd LT'),
},
];

const TeamStatusList = () => {
  return (
    <S.TeamStatusListWrapper>
      <S.TeamMembersWrapper>
        {mockTeamData.map(({
          id,
          name,
          location,
          status,
          lastDate,
          emoji,
        }) => (
          <TeamMemberItem
            key={id}
            name={name}
            location={location}
            status={status}
            lastDate={lastDate}
            emoji={emoji}
          />
        ))}
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
};

export default hot(TeamStatusList);
