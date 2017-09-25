// This component is currently reusable (used in both recent and all items)
import React, { PropTypes } from 'react';
import { shell } from 'electron';
import { getStatusColor } from 'jiraColors-util';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Tooltip from '@atlaskit/tooltip';

import { link } from 'data/svg';
import Flex from '../../../components/Base/Flex/Flex';
import {
  IssueContainer,
  IssueLink,
  IssueName,
  IssueDescription,
  IssueType,
  IssuePriority,
  IssueLabel,
} from './styled';

function openIssueInBrowser(issue) {
  return (ev) => {
    ev.preventDefault();
    const urlArr = issue.get('self').split('/');
    shell.openExternal(`${urlArr[0]}//${urlArr[2]}/browse/${issue.get('key')}`);
  };
}

const Issue = ({
  issue,
  worklog,
  selectIssue,
  selectWorklog,
  selectWorklogByIssueId,
  summary,
  active,
  onTracking,
  style,
}) => {
  const name = issue.get('key');
  const description = issue.getIn(['fields', 'summary']);
  const label = issue.getIn(['fields', 'status', 'statusCategory', 'name']);
  const type = issue.getIn(['fields', 'issuetype', 'name']);
  const priority = issue.getIn(['fields', 'priority', 'name']);
  const labelColor = getStatusColor(
    issue.getIn(['fields', 'status', 'statusCategory', 'colorName']),
  );

  return (
    <div style={style}>
      <IssueContainer
        active={active}
        onClick={() => {
          selectIssue(issue.get('id'));
          if (worklog) {
            selectWorklog(worklog.get('id'));
          } else {
            selectWorklogByIssueId(issue.get('id'));
          }
        }}
      >
        <Flex row style={{ alignItems: 'flex-end' }}>
          <IssueName>
            {name}
          </IssueName>
          <Tooltip
            description="Open in browser"
            position="bottom"
          >
            <IssueLink
              src={link}
              alt="Open in browser"
              onClick={openIssueInBrowser(issue)}
            />
          </Tooltip>
        </Flex>
        <IssueDescription>
          {description}
        </IssueDescription>
        <Flex row style={{ marginTop: 8 }}>
          <Tooltip
            description={type}
            position="bottom"
          >
            <IssueType
              type={type}
              src={issue.getIn(['fields', 'issuetype', 'iconUrl'])}
              alt="type"
            />
          </Tooltip>
          <Tooltip
            description={priority}
            position="bottom"
          >
            <IssuePriority
              priority={priority}
              src={issue.getIn(['fields', 'priority', 'iconUrl'])}
              alt="priority"
            />
          </Tooltip>
          {label &&
            <IssueLabel
              backgroundColor={labelColor}
              label={label}
            >
              {label.toUpperCase()}
            </IssueLabel>
          }
        </Flex>
      </IssueContainer>
    </div>
  );
};

Issue.propTypes = {
  selectIssue: PropTypes.func.isRequired,
  selectWorklog: PropTypes.func.isRequired,
  selectWorklogByIssueId: PropTypes.func.isRequired,
  worklog: ImmutablePropTypes.map.isRequired,
  issue: ImmutablePropTypes.map.isRequired,
  summary: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  onTracking: PropTypes.bool.isRequired,
};

export default Issue;
