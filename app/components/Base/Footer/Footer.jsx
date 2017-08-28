import React from 'react';

// import { avatarIcon, cogIcon } from 'data/svg';
import Flex from '../../../components/Base/Flex/Flex';
// import Flex from '@components/Base/Flex/Flex';
import {
  Footer,
  StatsLabel,
  StatsValue,
  Separator,
  WorkDiaryLink
} from './styled';

const today = '05:20';
const week = '23:40';

export default () => (
  <Footer>
    <Flex row centered style={{ width: '50%' }}>
      <Flex row style={{ marginRight: 10 }}>
        <StatsLabel>
          Today:
        </StatsLabel>
        <StatsValue>
          {today}
        </StatsValue>
      </Flex>
      <Flex row>
        <StatsLabel>
          Week:
        </StatsLabel>
        <StatsValue>
          {week}
        </StatsValue>
      </Flex>
    </Flex>
    <Separator />
    <Flex row centered style={{ width: '50%' }}>
      <WorkDiaryLink>
        View Work Diary
      </WorkDiaryLink>
    </Flex>
  </Footer>
);
