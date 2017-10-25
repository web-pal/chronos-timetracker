// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getSelectedIssue, getTimerRunning } from 'selectors';
import { Flex } from 'components';
import { openProjectInBrowser, openIssueInBrowser } from 'external-open-util';
import Tooltip from '@atlaskit/tooltip';
// import DropdownMenu, {
//   DropdownItemGroup,
//   DropdownItem,
// } from '@atlaskit/dropdown-menu';
import Button, { ButtonGroup } from '@atlaskit/button';
import { play } from 'data/svg';

import { timerActions, uiActions } from 'actions';

import type { Issue, StartTimer, SetWorklogModalOpen } from '../../types';
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
  IssueViewHeaderContainer,
} from './styled';


type Props = {
  selectedIssue: Issue,
  timerRunning: boolean,
  startTimer: StartTimer,
  setWorklogModalOpen: SetWorklogModalOpen
};

const IssueViewHeader: StatelessFunctionalComponent<Props> = ({
  selectedIssue,
  timerRunning,
  startTimer,
  setWorklogModalOpen,
}: Props):Node => (
  <IssueViewHeaderContainer>
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
      {timerRunning
        ? <StartButtonPlaceholder />
        : <StartButton
          src={play}
          alt="Start Tracking"
          onClick={() => {
            startTimer();
          }}
        />
      }
    </Flex>
    <Flex row>
      <ButtonGroup>
        {/*
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
        */}
        <Button onClick={() => setWorklogModalOpen(true)}>
          Log work
        </Button>
      </ButtonGroup>
    </Flex>
  </IssueViewHeaderContainer>
);

function mapStateToProps(state) {
  return {
    selectedIssue: getSelectedIssue(state),
    timerRunning: getTimerRunning(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...timerActions,
    ...uiActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueViewHeader);
