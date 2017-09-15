import React from 'react';
import { stopDarkBlue } from 'data/svg';
import { screenshot } from 'data/assets';
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
  EditSectionTitle,
  WorklogsInformation,
} from './styled';

// TODO: Worklogs Types
// import WorklogTypePicker from '../ComponentsWrappers/WorklogTypePickerWrapper';
// {(running && showWorklogTypes) &&
//   <WorklogTypePicker currentWorklogType={currentWorklogType} />
// }
// showWorklogTypes: worklogs.meta.showWorklogTypes,

// TODO: Description
// {running &&
//   <TextareaAutosize
//     autoFocus
//     id="descriptionInput"
//     value={description}
//     style={{ minHeight: 15, maxHeight: 180 }}
//     className="descriptionInput"
//     onChange={e => setDescription(e.target.value)}
//     placeholder="What are you doing?"
//   />
// }

// <Gallery images={screenshots} deleteScreenshot={deleteScreenshotRequest} />

import {
  H100,
  H200,
  H300,
  H400,
  H500,
  H600,
  H700,
  H800,
} from '../../styles/typography';
import {
  Button,
} from '../../styles/buttons';

// eslint-disable-next-line
export default ({ isActive }) => (
  <TrackingViewContainer isActive={isActive}>
    <StopButton src={stopDarkBlue} alt="stop" />
    <EditSection>
      <Flex column>
        <H400>
          You started at 17:24
        </H400>
        <H200>Worklog type</H200>
        <H200>Note</H200>
      </Flex>
      <VerticalSeparator />
      <Flex column>
        <StatsItem>
          Logged today: <H300>4h</H300>
        </StatsItem>
        <StatsItem>
          Estimated: <H300>7h</H300>
        </StatsItem>
        <StatsItem>
          Remaining: <H300>3h</H300>
        </StatsItem>
        <Button>View report</Button>
      </Flex>
    </EditSection>
    <WorklogsSection>
      <H400 style={{ marginBottom: 10 }}>
        Last worklog
      </H400>
      <Flex row>
        <LastScreenshot src={screenshot} alt="" />
        <WorklogsInformation>
          10 minutes ago you logged 2h
          <Flex row>
            <Button style={{ marginRight: 5 }}>
              Add worklog
            </Button>
            <Button>
              See worklogs
            </Button>
          </Flex>
        </WorklogsInformation>
      </Flex>
    </WorklogsSection>
  </TrackingViewContainer>
);
