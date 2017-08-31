import React from 'react';
import Flex from '../../../../components/Base/Flex/Flex';

import {
  TimelineItem,
  TimelineCircle,
  TimelineLine,
  TimelineLineContainer,
  Time,
  Screenshot,
  ActivityContainer,
  ActivityRecord,
  ActivityLine,
  Worklog,
  WorklogTime,
} from './styled';

export default () => (
  <TimelineItem>
    <TimelineLineContainer>
      <TimelineCircle />
      <TimelineLine />
    </TimelineLineContainer>
    <Flex column>
      <Time>13:00</Time>
      {[1, 2, 3].map(() => (
        <Flex column>
          <Worklog>
            <WorklogTime />
            <Screenshot />
            <ActivityContainer>
              <ActivityLine />
              <ActivityRecord />
            </ActivityContainer>
          </Worklog>
        </Flex>
      ))}
    </Flex>
  </TimelineItem>
);
