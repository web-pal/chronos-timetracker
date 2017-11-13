import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';

import Tooltip from '@atlaskit/tooltip';
import CommentIcon from '@atlaskit/icon/glyph/comment';
import { Flex } from 'components';
import {
  WorklogItemContainer,
  Summary,
  IssueKey,
  Time,
  IssueMeta,
  IssueType,
} from './styled';

import type { Issue, SelectIssue, Worklog } from '../../../../types';

type Props = {
  issue: Issue,
  worklog: Worklog,
  active: boolean,
  selectIssue: SelectIssue,
}

const WorklogItem: StatelessFunctionalComponent<Props> = ({
  active,
  issue,
  worklog,
  selectIssue,
}: Props): Node =>
  <WorklogItemContainer
    isSelected={active}
    onClick={() => {
      selectIssue(issue);
    }}
  >
    <Flex column>
      <Summary>{issue.fields.summary}</Summary>
      <IssueMeta>
        <Tooltip
          description={issue.fields.issuetype.name}
          position="bottom"
        >
          <IssueType
            type={issue.fields.issuetype.name}
            src={issue.fields.issuetype.iconUrl}
            alt="type"
          />
        </Tooltip>
        <IssueKey>{issue.key}</IssueKey>
        {/*
        <Tooltip
          description={issue.fields.issuetype.name}
          position="bottom"
        >
          <CameraIcon
            size="small"
            label="Screenshot"
            primaryColor={issue.key === 'CDESKTOP-102' ? '#0052CC' : '#7A869A'}
          />
        </Tooltip>
        */}
        {(issue.comment && issue.comment !== '') &&
          <Tooltip
            description={issue.comment || 'No comment'}
            position="bottom"
          >
            <CommentIcon
              size="small"
              label="Momment"
              primaryColor={(issue.comment && issue.comment !== '') ? '#0052CC' : '#7A869A'}
            />
          </Tooltip>
        }
      </IssueMeta>
    </Flex>
    <Time>{worklog.timeSpent}</Time>
  </WorklogItemContainer>;

export default WorklogItem;
