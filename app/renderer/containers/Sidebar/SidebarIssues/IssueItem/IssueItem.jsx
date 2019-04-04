// @flow
import React from 'react';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';
import type {
  Id,
  Issue,
} from 'types';

import Tooltip from '@atlaskit/tooltip';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import {
  getStatusColor,
} from 'utils/jiraColors-util';
import {
  openURLInBrowser,
} from 'utils/external-open-util';

import * as S from './styled';


type Props = {
  issue: Issue,
  active: boolean,
  baseUrl: string,
  selectIssue: (issueId: Id) => void
};

const IssueItem: StatelessFunctionalComponent<Props> = ({
  issue,
  active,
  selectIssue,
  baseUrl,
}: Props = {}): Node => (
  <S.Issue
    active={active}
    onClick={() => {
      selectIssue(issue.id);
    }}
  >
    <S.IssueName>
      <S.IssueText>
        {issue.key}
      </S.IssueText>
      <Tooltip
        description="Open in browser"
        position="bottom"
      >
        <span onClick={openURLInBrowser(`${baseUrl}/browse/${issue.key}`)}>
          <ShortcutIcon
            label="Open in browser"
            size="small"
            primaryColor="#0052CC"
          />
        </span>
      </Tooltip>
    </S.IssueName>
    <S.IssueDescription>
      {issue.fields.summary}
    </S.IssueDescription>
    <S.IssueFields>
      {issue.fields.issuetype
        && (
        <Tooltip
          description={issue.fields.issuetype.name}
          position="bottom"
        >
          <S.IssueType
            type={issue.fields.issuetype.name}
            src={issue.fields.issuetype.iconUrl}
            alt="type"
          />
        </Tooltip>
        )
      }
      {issue.fields.priority
        && (
        <Tooltip
          description={issue.fields.priority.name}
          position="bottom"
        >
          <S.IssuePriority
            priority={issue.fields.priority.name}
            src={issue.fields.priority.iconUrl}
            alt="priority"
          />
        </Tooltip>
        )
      }
      {issue.fields.status
        && (
        <S.IssueLabel
          backgroundColor={getStatusColor(issue.fields.status.statusCategory.colorName)}
        >
          {issue.fields.status.name.toUpperCase()}
        </S.IssueLabel>
        )
      }
    </S.IssueFields>
  </S.Issue>
);

export default IssueItem;
