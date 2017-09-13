import React from 'react';
// import { pause } from 'data/svg';
import Flex from '../../components/Base/Flex/Flex';
import {
  TrackingViewContainer,
  StopButton,
  EditSection,
  VerticalSeparator,
  StatsItem,
  WorklogsSection,
  WorklogsSectionTitle,
  LastScreenshot,
  Button,
  EditSectionTitle,
} from './styled';

// eslint-disable-next-line
export default ({ isActive }) => (
  <TrackingViewContainer isActive={isActive}>
    <StopButton />
    <EditSection>
      <Flex column>
        <EditSectionTitle>
          You started at 17:24
        </EditSectionTitle>
      </Flex>
      <VerticalSeparator />
      <Flex column>
        <StatsItem>Logged today: 4h</StatsItem>
        <StatsItem>Estimated: 7h</StatsItem>
        <StatsItem>Remaining: 3h</StatsItem>
        <Button>View report</Button>
      </Flex>
    </EditSection>
    <WorklogsSection>
      <WorklogsSectionTitle>
        Last worklog
      </WorklogsSectionTitle>
      <Flex row>
        <LastScreenshot />
        <Flex column>
          10 minutes ago you logged 2h
        </Flex>
        <Flex row>
          <Button>
            Add worklog
          </Button>
          <Button>
            See worklogs
          </Button>
        </Flex>
      </Flex>
    </WorklogsSection>
  </TrackingViewContainer>
);
