import React from 'react';
import { projectAvatar, arrowDown, play } from 'data/svg';
import { userAvatar } from 'data/assets';
import Flex from '../../../../components/Base/Flex/Flex';

import {
  ProjectAvatar,
  Link,
  IssueLabel,
  Breadcrumb,
  ActionButton,
  UserAvatar,
  StartButton,
} from './styled';

export default () => (
  <Flex column style={{ margin: 20, minHeight: 102 }}>
    <Flex row alignCenter spaceBetween style={{ marginBottom: 15 }}>
      <Flex row alignCenter>
        <ProjectAvatar src={projectAvatar} alt="" />
        <UserAvatar src={userAvatar} alt="" />
        <Flex column>
          <Flex row>
            <Link>TimetrackerPlugin</Link>
            <Breadcrumb>/</Breadcrumb>
            <Link>TTP-24</Link>
          </Flex>
          <IssueLabel>
            Remember Group-by
          </IssueLabel>
        </Flex>
      </Flex>
      <StartButton src={play} alt="Start Tracking" />
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
