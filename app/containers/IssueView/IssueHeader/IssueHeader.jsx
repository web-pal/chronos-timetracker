import React from 'react';
import { projectAvatar, arrowDown, play } from 'data/svg';
import { userAvatar } from 'data/assets';
import Flex from '../../../components/Base/Flex/Flex';

import {
  ProjectAvatar,
  Link,
  IssueLabel,
  Breadcrumb,
  ActionButton,
  UserAvatar,
  StartButton,
} from './styled';

export default (props) => {
  // eslint-disable-next-line
  const { isTracking, currentIssue } = props;

  return (
    <Flex column style={{ margin: 20, minHeight: 102 }}>
      <Flex row alignCenter spaceBetween style={{ marginBottom: 15 }}>
        <Flex row alignCenter>
          <ProjectAvatar
            src={currentIssue.getIn(['fields', 'project', 'avatarUrls', '48x48'])}
            alt=""
          />
          <UserAvatar
            src={currentIssue.getIn(['fields', 'assignee', 'avatarUrls', '48x48'])}
            alt=""
          />
          <Flex column>
            <Flex row>
              <Link>{currentIssue.getIn(['fields', 'project', 'name'])}</Link>
              <Breadcrumb>/</Breadcrumb>
              <Link>{currentIssue.get('key')}</Link>
            </Flex>
            <IssueLabel>
              {currentIssue.getIn(['fields', 'summary'])}
            </IssueLabel>
          </Flex>
        </Flex>
        <StartButton
          src={play}
          alt="Start Tracking"
          style={{ opacity: isTracking ? 0 : 1 }}
        />
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
