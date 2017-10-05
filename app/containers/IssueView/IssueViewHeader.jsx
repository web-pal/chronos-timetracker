// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getSelectedIssue, getTrackingIssueId, getTimerRunning } from 'selectors';
import { Flex } from 'components';
import { openProjectInBrowser, openIssueInBrowser } from 'external-open-util';
import Tooltip from '@atlaskit/tooltip';
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';
import Button, { ButtonGroup } from '@atlaskit/button';
import { play } from 'data/svg';
import { timerActions } from 'actions';

import type { Issue, Id, StartTimer } from '../../types';
import {
  ProjectAvatar,
  Link,
  Breadcrumb,
  UserAvatarContainer,
  UserAvatar,
  UserSampleAvatar,
  StartButton,
  StartButtonPlaceholder,
  IssueSummary,
} from './styled';


type Props = {
  selectedIssue: Issue,
  trackingIssueId: Id | null,
  timerRunning: boolean,
  startTimer: StartTimer,
};

const IssueViewHeader: StatelessFunctionalComponent<Props> = ({
  selectedIssue,
  trackingIssueId,
  timerRunning,
  startTimer,
}: Props):Node => (
  <Flex column style={{ margin: '16px 20px', minHeight: 102 }}>
    <Flex row alignCenter spaceBetween style={{ marginBottom: 15 }}>
      <Flex row alignCenter>
        <ProjectAvatar
          src={selectedIssue.fields.project.avatarUrls['48x48']}
          alt=""
        />
        <UserAvatarContainer>
          {selectedIssue.fields.assignee ?
            <UserAvatar
              src={selectedIssue.fields.assignee.avatarUrls['48x48']}
              alt="User Avatar"
            /> :
            <UserSampleAvatar
              size="medium"
              label="User Avatar Placeholder"
              primaryColor="#0052cc"
              secondaryColor="white"
            />
          }
        </UserAvatarContainer>
        <Flex column>
          <Flex row>
            {/* TODO: MAKE project name a link */}
            <Link onClick={openProjectInBrowser(selectedIssue.fields.project)}>
              {selectedIssue.fields.project.name}
            </Link>
            <Breadcrumb>/</Breadcrumb>
            <Link onClick={openIssueInBrowser(selectedIssue)}>
              {selectedIssue.key}
            </Link>
          </Flex>
          <Tooltip
            description={selectedIssue.fields.summary}
            position="bottom"
          >
            <IssueSummary>
              {selectedIssue.fields.summary}
            </IssueSummary>
          </Tooltip>
        </Flex>
      </Flex>
      {(timerRunning && selectedIssue.id === trackingIssueId)
        ? <StartButtonPlaceholder />
        : <StartButton
          src={play}
          alt="Start Tracking"
          onClick={() => { startTimer(); }}
        />
      }
    </Flex>
    <Flex row>
      <ButtonGroup>
        <Button>
          Comment
        </Button>
        <Button>
          Assign to me
        </Button>
        <DropdownMenu
          trigger="Workflow"
          triggerType="button"
          shouldFlip={false}
          position="bottom left"
        >
          <DropdownItemGroup>
            <DropdownItem>Selected for development</DropdownItem>
            <DropdownItem>Done</DropdownItem>
          </DropdownItemGroup>
        </DropdownMenu>
        <Button>
          Add to favorites
        </Button>
      </ButtonGroup>
    </Flex>
  </Flex>
);

function mapStateToProps(state) {
  return {
    selectedIssue: getSelectedIssue(state),
    trackingIssueId: getTrackingIssueId(state),
    timerRunning: getTimerRunning(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(timerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueViewHeader);
