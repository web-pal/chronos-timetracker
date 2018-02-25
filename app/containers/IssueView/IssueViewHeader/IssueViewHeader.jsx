// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';
import {
  getStatus as getResourceStatus,
} from 'redux-resource';
import {
  ipcRenderer,
} from 'electron';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';
import type {
  Connector,
} from 'react-redux';

import {
  Flex,
} from 'components';
import {
  openProjectInBrowser,
  openIssueInBrowser,
} from 'external-open-util';

import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';

import Tooltip from '@atlaskit/tooltip';
import Button, {
  ButtonGroup,
} from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';
import {
  getUiState,
  getTimerState,
  getSelectedIssue,
  getSelfKey,
  getResourceMappedList,
} from 'selectors';

import {
  timerActions,
  uiActions,
  issuesActions,
} from 'actions';

import type {
  Issue,
  IssueStatus,
  Dispatch,
} from 'types';
import {
  ProjectAvatar,
  ALink,
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
  transitionsIsFetching: boolean,
  issueTransitions: Array<IssueStatus>,
  selfKey: string,
  host: string,
  protocol: string,
  dispatch: Dispatch,
};

const IssueViewHeader: StatelessFunctionalComponent<Props> = ({
  selectedIssue,
  timerRunning,
  transitionsIsFetching,
  issueTransitions,
  selfKey,
  host,
  protocol,
  dispatch,
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
            <ALink onClick={openProjectInBrowser(selectedIssue.fields.project)}>
              {selectedIssue.fields.project.name}
            </ALink>
            <Breadcrumb>/</Breadcrumb>
            <ALink onClick={openIssueInBrowser(selectedIssue)}>
              {selectedIssue.key}
            </ALink>
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
          alt="Start Tracking"
          onClick={() => {
            dispatch(timerActions.startTimer());
          }}
        />
      }
    </Flex>
    <Flex row>
      <ButtonGroup>
        <Button
          onClick={() => {
            dispatch(uiActions.setUiState(
              'editWorklogId',
              null,
            ));
            dispatch(uiActions.setUiState(
              'worklogFormIssueId',
              selectedIssue.id,
            ));
            dispatch(uiActions.setModalState(
              'worklog',
              true,
            ));
          }}
        >
          Log work
        </Button>
        <div style={{ width: 10 }} />
        <DropdownMenu
          trigger="Workflow"
          triggerType="button"
          shouldFlip={false}
          position="bottom left"
          shouldFitContainer
        >
          <DropdownItemGroup>
            {transitionsIsFetching &&
              <DropdownItem>
                <Flex row justifyCenter>
                  <Spinner />
                </Flex>
              </DropdownItem>
            }
            {!transitionsIsFetching && issueTransitions.map(t =>
              <DropdownItem
                key={t.id}
                onClick={() => {
                  dispatch(issuesActions.transitionIssueRequest(
                    t.id,
                    selectedIssue.id,
                  ));
                }}
              >
                {t.name}
              </DropdownItem>)
            }
          </DropdownItemGroup>
        </DropdownMenu>
        <div style={{ width: 10 }} />
        {(selectedIssue.fields.assignee === null ||
          selectedIssue.fields.assignee.key !== selfKey) &&
          <Button
            onClick={() => {
              dispatch(issuesActions.assignIssueRequest(
                selectedIssue.id,
              ));
            }}
          >
            Assign to me
          </Button>
        }
        <Button
          onClick={() => {
            ipcRenderer.send(
              'open-edit-issue-window',
              {
                issueId: selectedIssue.id,
                url: `${protocol}://${host}/browse/${selectedIssue.key}`,
              },
            );
          }}
        >
          Edit
        </Button>
      </ButtonGroup>
    </Flex>
  </IssueViewHeaderContainer>
);

function mapStateToProps(state) {
  return {
    host: getUiState('host')(state),
    protocol: getUiState('protocol')(state),
    selectedIssue: getSelectedIssue(state),
    timerRunning: getTimerState('running')(state),
    issueTransitions: getResourceMappedList(
      'issuesStatuses',
      'issueTransitions',
    )(state),
    transitionsIsFetching: getResourceStatus(
      state,
      'issuesStatuses.requests.issueTransitions.status',
    ).pending,
    selfKey: getSelfKey(state),
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(IssueViewHeader);
