// TODO: need a bug test
// expected behavior: start button is only visible on issues which are not currently being tracked
import React from 'react';
import { shell } from 'electron';
import Tooltip from '@atlaskit/tooltip';
import { arrowDown, play, avatarIcon } from 'data/svg';
import Flex from '../../../components/Base/Flex/Flex';

import {
  ProjectAvatar,
  Link,
  Breadcrumb,
  ActionButton,
  UserAvatar,
  StartButton,
  StartButtonPlaceholder,
  IssueSummary,
} from './styled';

function openIssueInBrowser(issue) {
  return (ev) => {
    ev.preventDefault();
    const urlArr = issue.get('self').split('/');
    shell.openExternal(`${urlArr[0]}//${urlArr[2]}/browse/${issue.get('key')}`);
  };
}

function openProjectInBrowser(project) {
  return (ev) => {
    ev.preventDefault();
    const urlArr = project.get('self').split('/');
    shell.openExternal(`${urlArr[0]}//${urlArr[2]}/projects/${project.get('key')}`);
  };
}

export default (props) => {
  // eslint-disable-next-line
  const { running, currentIssue, currentTrackingIssue, startTimer } = props;

  return (
    <Flex column style={{ margin: '16px 20px', minHeight: 102 }}>
      <Flex row alignCenter spaceBetween style={{ marginBottom: 15 }}>
        <Flex row alignCenter>
          <ProjectAvatar
            src={currentIssue.getIn(['fields', 'project', 'avatarUrls', '48x48'])}
            alt=""
          />
          <UserAvatar
            src={currentIssue.getIn(['fields', 'assignee', 'avatarUrls', '48x48']) || avatarIcon}
            alt=""
          />
          <Flex column>
            <Flex row>
              {/* TODO: MAKE project name a link */}
              <Link onClick={openProjectInBrowser(currentIssue.getIn(['fields', 'project']))}>
                {currentIssue.getIn(['fields', 'project', 'name'])}
              </Link>
              <Breadcrumb>/</Breadcrumb>
              <Link onClick={openIssueInBrowser(currentIssue)}>
                {currentIssue.get('key')}
              </Link>
            </Flex>
            <Tooltip
              description={currentIssue.getIn(['fields', 'summary'])}
              position="bottom"
            >
              <IssueSummary>
                {currentIssue.getIn(['fields', 'summary'])}
              </IssueSummary>
            </Tooltip>
          </Flex>
        </Flex>
        {(running && currentIssue.get('id') === currentTrackingIssue.get('id')) ?
          <StartButtonPlaceholder /> :
          <StartButton
            src={play}
            alt="Start Tracking"
            onClick={startTimer}
          />
        }
      </Flex>
      <Flex row>
        <ActionButton>
          Comment
        </ActionButton>
        <ActionButton>
          Assign to me
        </ActionButton>
        <ActionButton>
          Workflow
          <img style={{ marginLeft: 5 }} src={arrowDown} alt="Expand" />
        </ActionButton>
        <ActionButton>
          Add to favorites
        </ActionButton>
      </Flex>
    </Flex>
  );
};
