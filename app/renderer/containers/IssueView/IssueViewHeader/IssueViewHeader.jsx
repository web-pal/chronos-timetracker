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
} from 'utils/external-open-util';

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
  getResourceMeta,
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
  allowEdit: boolean,
  transitionsIsFetching: boolean,
  issueTransitions: Array<IssueStatus>,
  selfKey: string,
  dispatch: Dispatch,
};

const IssueViewHeader: StatelessFunctionalComponent<Props> = ({
  selectedIssue,
  timerRunning,
  allowEdit,
  transitionsIsFetching,
  issueTransitions,
  selfKey,
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
        <div
          style={{ marginLeft: '10px' }}
        >
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
        </div>
        {(selectedIssue.fields.assignee === null ||
          selectedIssue.fields.assignee.key !== selfKey) &&
          <div
            style={{ marginLeft: '10px' }}
          >
            <Button
              onClick={() => {
                dispatch(issuesActions.assignIssueRequest(
                  selectedIssue.id,
                ));
              }}
            >
              Assign to me
            </Button>
          </div>
        }
        <div
          style={{ marginLeft: '10px' }}
        >
          <Button
            isDisabled={!allowEdit}
            onClick={() => {
              ipcRenderer.send(
                'show-issue-window',
                {
                  issueId: selectedIssue.id,
                },
              );
            }}
          >
            Edit
          </Button>
        </div>
      </ButtonGroup>
    </Flex>
  </IssueViewHeaderContainer>
);

function mapStateToProps(state) {
  const selectedIssue = getSelectedIssue(state);
  let allowEdit = false;
  if (selectedIssue) {
    const issueMeta = getResourceMeta('issues', selectedIssue.id)(state);
    allowEdit = issueMeta.permissions ? issueMeta.permissions.EDIT_ISSUE.havePermission : false;
  }
  return {
    host: getUiState('host')(state),
    protocol: getUiState('protocol')(state),
    timerRunning: getTimerState('running')(state),
    selectedIssue,
    allowEdit,
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
