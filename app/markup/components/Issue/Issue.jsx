import React from 'react';
import Tooltip from '@atlaskit/tooltip';

import { taskType, majorPriority, link, play } from 'data/svg';
import Flex from '../../../components/Base/Flex/Flex';
import {
  Issue,
  IssueLink,
  IssueName,
  IssueDescription,
  IssueType,
  IssuePriority,
  IssueLabel,
  StartTimerButton,
} from './styled';

const name = 'TTP-281';
const description = 'Change worklog type setting';
const type = 'Task';
const priority = 'Major';
const label = 'In Progress';

export default () => (
  <Issue>
    <Flex column>
      <Flex row>
        <IssueName>
          {name}
        </IssueName>
        <IssueLink src={link} alt="" />
      </Flex>
      <IssueDescription>
        {description}
      </IssueDescription>
      <Flex row style={{ marginTop: 10 }}>
        <Tooltip
          description={type}
          position="bottom"
        >
          <IssueType type={type} src={taskType} alt="" />
        </Tooltip>
        <Tooltip
          description={priority}
          position="bottom"
        >
          <IssuePriority priority={priority} src={majorPriority} alt="" />
        </Tooltip>
        <IssueLabel label={label}>
          IN PROGRESS
        </IssueLabel>
      </Flex>
    </Flex>
    <StartTimerButton src={play} alt="Start Tracking" />
  </Issue>
);
