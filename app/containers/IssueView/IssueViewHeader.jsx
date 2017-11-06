// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Flex } from 'components';
import { openProjectInBrowser, openIssueInBrowser } from 'external-open-util';
import DropdownMenu, { DropdownItemGroup, DropdownItem } from '@atlaskit/dropdown-menu';
import Tooltip from '@atlaskit/tooltip';
import Button, { ButtonGroup } from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';
import { play } from 'data/svg';
import {
  getSelectedIssue,
  getTimerRunning,
  getAvailableTransitionsFetching,
  getAvailableTransitions,
  getUserData,
} from 'selectors';

import { timerActions, uiActions, issuesActions } from 'actions';

import type {
  Issue,
  StartTimer,
  SetWorklogModalOpen,
  IssueTransition,
  TransitionIssueRequest,
  AssignIssueRequest,
} from '../../types';
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
  availableTransitions: Array<IssueTransition>,
  availableTransitionsFetching: boolean,
  selfKey: string,
  startTimer: StartTimer,
  setWorklogModalOpen: SetWorklogModalOpen,
  transitionIssueRequest: TransitionIssueRequest,
  assignIssueRequest: AssignIssueRequest,
};

const IssueViewHeader: StatelessFunctionalComponent<Props> = ({
  selectedIssue,
  timerRunning,
  availableTransitions,
  availableTransitionsFetching,
  selfKey,
  startTimer,
  setWorklogModalOpen,
  transitionIssueRequest,
  assignIssueRequest,
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
            Add to favorites
          </Button>
        */}
        <Button onClick={() => setWorklogModalOpen(true)}>
          Log work
        </Button>
        <div style={{ width: 10 }} />
        {availableTransitionsFetching
          ? <Button isDisabled iconAfter={<Spinner />} >
            Workflow
          </Button>
          : <DropdownMenu
            trigger="Workflow"
            triggerType="button"
            shouldFlip={false}
            position="bottom left"
            shouldFitContainer
          >
            <DropdownItemGroup>
              {availableTransitions.map(t =>
                <DropdownItem
                  key={t.id}
                  onClick={() => transitionIssueRequest(t, selectedIssue)}
                >
                  {t.name}
                </DropdownItem>)
              }
            </DropdownItemGroup>
          </DropdownMenu>
        }
        <div style={{ width: 10 }} />
        {(selectedIssue.fields.assignee === null ||
          selectedIssue.fields.assignee.key !== selfKey) &&
          <Button onClick={() => assignIssueRequest(selectedIssue)}>
            Assign to me
          </Button>
        }
      </ButtonGroup>
    </Flex>
  </IssueViewHeaderContainer>
);

function mapStateToProps(state) {
  return {
    selectedIssue: getSelectedIssue(state),
    timerRunning: getTimerRunning(state),
    availableTransitions: getAvailableTransitions(state),
    availableTransitionsFetching: getAvailableTransitionsFetching(state),
    selfKey: getUserData(state).key,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...timerActions,
    ...uiActions,
    ...issuesActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueViewHeader);
