// @flow
import React from 'react';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';
import type {
  Id,
  Issue,
  Worklog,
} from 'types';

import Tooltip from '@atlaskit/tooltip';
import CommentIcon from '@atlaskit/icon/glyph/comment';
import Button from '@atlaskit/button';

import {
  Flex,
} from 'components';
import * as S from './styled';


type Props = {
  active: boolean,
  issue: Issue,
  worklog: Worklog,
  showShowButton: boolean,
  selectIssue: (id: Id) => void,
  onClickShow: (id: Id) => void,
}

const WorklogItem: StatelessFunctionalComponent<Props> = ({
  active,
  issue,
  worklog,
  selectIssue,
  showShowButton,
  onClickShow,
}: Props): Node =>
  <S.WorklogItem
    isSelected={active}
    onClick={() => {
      selectIssue(issue.id);
    }}
  >
    <Flex column>
      <S.Summary>{issue.fields.summary}</S.Summary>
      <S.IssueMeta>
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
        <S.IssueKey>{issue.key}</S.IssueKey>
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
      </S.IssueMeta>
    </Flex>
    {showShowButton &&
      <Button onClick={() => onClickShow(issue.id)}>
        show
      </Button>
    }
    <S.Time>{worklog.timeSpent}</S.Time>
  </S.WorklogItem>;

export default WorklogItem;
