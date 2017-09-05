import React from 'react';
import { pause } from 'data/svg';
import Flex from '../../../components/Base/Flex/Flex';
import {
  TrackingBarContainer,
  StartTimer,
  TaskName,
  Timer,
  Button,
} from './styled';

export default () => (
  <TrackingBarContainer>
    <Flex column>
      <TaskName>TTP-340</TaskName>
      <Flex row>
        <Button style={{ marginRight: 5 }}>More</Button>
        <Button>Jump</Button>
      </Flex>
    </Flex>

    <Flex row alignCenter>
      <Flex column>
        <Timer>01:24</Timer>
      </Flex>
      <StartTimer src={pause} alt="Start" />
    </Flex>
  </TrackingBarContainer>
);

