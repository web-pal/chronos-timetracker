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
  openIssueInBrowser,
} from 'utils/external-open-util';

import {
  IssueContainer,
  IssueNameContainer,
  IssueName,
  IssueDescription,
  IssueFieldsContainer,
  IssueType,
  IssuePriority,
  IssueLabel,
} from './styled';


type Props = {
  issue: Issue,
  active: boolean,
  selectIssue: (issueId: Id) => void
}

const IssueItem: StatelessFunctionalComponent<Props> = ({
  issue,
  active,
  selectIssue,
}: Props = {}): Node =>
  <IssueContainer
    active={active}
    onClick={() => {
      selectIssue(issue.id);
    }}
  >
    <IssueNameContainer>
      <IssueName>
        {issue.key}
      </IssueName>
      <Tooltip
        description="Open in browser"
        position="bottom"
      >
        <ShortcutIcon
          label="Open in browser"
          size="small"
          onClick={openIssueInBrowser(issue)}
          primaryColor="#0052CC"
        />
      </Tooltip>
    </IssueNameContainer>
    <IssueDescription>
      {issue.fields.summary}
    </IssueDescription>
    <IssueFieldsContainer>
      {issue.fields.issuetype &&
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
      }
      {issue.fields.priority &&
        <Tooltip
          description={issue.fields.priority.name}
          position="bottom"
        >
          <IssuePriority
            priority={issue.fields.priority.name}
            src={issue.fields.priority.iconUrl}
            alt="priority"
          />
        </Tooltip>
      }
      {issue.fields.status &&
        <IssueLabel
          backgroundColor={getStatusColor(issue.fields.status.statusCategory.colorName)}
        >
          {issue.fields.status.name.toUpperCase()}
        </IssueLabel>
      }
    </IssueFieldsContainer>
  </IssueContainer>;

export default IssueItem;
