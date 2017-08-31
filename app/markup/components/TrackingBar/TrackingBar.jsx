import React from 'react';
import { play } from 'data/svg';
import Flex from '../../../components/Base/Flex/Flex';
import {
  TrackingBarContainer,
  StartTimer,
  TaskName,
  StatsItem,
  Timer,
  AddTime,
} from './styled';

export default () => (
  <TrackingBarContainer>
    <Flex column>
      <TaskName>TTP-340</TaskName>
      <StatsItem>Logged: 2h 30min</StatsItem>
      <StatsItem>View Detailed Statistics</StatsItem>
    </Flex>

    <Flex row alignCenter>
      <Flex column>
        <Timer>01:24</Timer>
        <AddTime>Add Time</AddTime>
      </Flex>
      <StartTimer src={play} alt="Start" />
    </Flex>
  </TrackingBarContainer>
);

