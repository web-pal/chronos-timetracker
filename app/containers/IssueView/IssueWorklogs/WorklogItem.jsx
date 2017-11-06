// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import ScreenIcon from '@atlaskit/icon/glyph/screen';
import { Flex } from 'components';

import {
  TimelineItem,
  TimelineCircle,
  TimelineLine,
  TimelineLineContainer,
  Time,
  ScreenshotContainer,
  // Screenshot,
  ActivityContainer,
  ActivityRecord,
  ActivityLineOuter,
  ActivityLineInner,
  Worklog,
  WorklogTime,
} from './styled';

const WorklogItem: StatelessFunctionalComponent<{}> = (): Node => (
  <TimelineItem>
    <TimelineLineContainer>
      <TimelineCircle />
      <TimelineLine />
    </TimelineLineContainer>
    <Flex column>
      <Time>13:00</Time>
      <Flex row style={{ overflowX: 'auto' }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Worklog key={i}>
            <ScreenshotContainer>
              {
                /* {screenshotUrl ?
                <Screenshot src={screenshotUrl} alt="Screenshot" /> :
                */
              }
              <ScreenIcon size="large" primaryColor="" label="Screenshot" />
            </ScreenshotContainer>
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

export default WorklogItem;
