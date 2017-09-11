import React from 'react';
import { monitor } from 'data/svg';
import Flex from '../../../components/Base/Flex/Flex';

import {
  TimelineItem,
  TimelineCircle,
  TimelineLine,
  TimelineLineContainer,
  Time,
  Screenshot,
  ActivityContainer,
  ActivityRecord,
  ActivityLineOuter,
  ActivityLineInner,
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
      <Flex row style={{ overflowX: 'auto' }}>
        {[1, 2, 3, 4, 5, 6].map(() => (
          <Worklog>
            <Screenshot src={monitor} alt="No screenshot" />
            <WorklogTime>14:00 - 14:10</WorklogTime>
            <ActivityContainer>
              <ActivityLineOuter>
                <ActivityLineInner percent="86" />
              </ActivityLineOuter>
              <ActivityRecord> 86% of 10 minutes</ActivityRecord>
            </ActivityContainer>
          </Worklog>
        ))}
      </Flex>
    </Flex>
  </TimelineItem>
);
