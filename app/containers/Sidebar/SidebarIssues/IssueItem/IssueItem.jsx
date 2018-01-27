// @flow
import React from 'react';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

import Tooltip from '@atlaskit/tooltip';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import {
  getStatusColor,
} from 'jiraColors-util';
import {
  openIssueInBrowser,
} from 'external-open-util';

import {
  IssueContainer,
  IssueNameContainer,
  IssueName,
  IssueDescription,
  IssueFieldsContainer,
  IssueType,
  IssuePriority,
  IssueLabel,
  TimeLogged,
} from './styled';

import type {
  Issue,
  SelectIssue,
  Worklog,
} from '../../../../types';


type Props = {
  issue: Issue,
  worklog?: Worklog | null,
  active: boolean,
  selectIssue: SelectIssue,
}

const IssueItem: StatelessFunctionalComponent<Props> = ({
  issue,
  worklog,
  active,
  selectIssue,
}: Props = {}): Node =>
  <IssueContainer
    active={active}
    onClick={() => {
      selectIssue(issue);
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
      <IssueLabel
        backgroundColor={getStatusColor(issue.fields.status.statusCategory.colorName)}
      >
        {issue.fields.status.name.toUpperCase()}
      </IssueLabel>
      {worklog &&
        <Tooltip
          description="Time logged"
          position="bottom"
        >
          <TimeLogged>
            {worklog.timeSpent}
          </TimeLogged>
        </Tooltip>
      }
    </IssueFieldsContainer>
  </IssueContainer>;

export default IssueItem;
