// @flow
import React from 'react';
import moment from 'moment';
import {
  connect,
} from 'react-redux';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';
import type {
  Connector,
} from 'react-redux';
import type {
  Issue,
  Dispatch,
} from 'types';

import {
  getUiState,
  getTrackingIssue,
  getTimerState,
} from 'selectors';
import {
  timerActions,
  uiActions,
} from 'actions';
import {
  Flex,
} from 'components';
import {
  CSSTransitionGroup,
} from 'react-transition-group';
import CameraIcon from '@atlaskit/icon/glyph/camera';
import Tooltip from '@atlaskit/tooltip';

import WorklogCommentDialog from './WorklogCommentDialog';
import {
  IssueName,
  Dot,
  Time,
  StopButton,
  Container,
} from './styled';


type Props = {
  time: number,
  screenshotUploading: boolean,
  screenshotsAllowed: boolean,
  trackingIssue: Issue,
  worklogComment: string,
  dispatch: Dispatch,
}

function addLeadingZero(s: number): string {
  return s < 10 ? `0${s}` : `${s}`;
}

function getTimeString(time: number): string {
  const timeMoment = moment.duration(time * 1000);
  return [
    `${timeMoment.hours() ? `${addLeadingZero(timeMoment.hours())}:` : ''}`,
    `${addLeadingZero(timeMoment.minutes())}:${addLeadingZero(timeMoment.seconds())}`,
  ].join('');
}

const TrackingBar: StatelessFunctionalComponent<Props> = ({
  time,
  screenshotUploading,
  screenshotsAllowed,
  trackingIssue,
  worklogComment,
  dispatch,
}: Props): Node => (
  <CSSTransitionGroup
    transitionName="tracking-bar"
    transitionAppear
    transitionAppearTimeout={250}
    transitionEnter={false}
    transitionLeave={false}
  >
    <Container>
      <Flex row alignCenter>
        <WorklogCommentDialog
          comment={worklogComment}
          onSetComment={(comment) => {
            dispatch(uiActions.setUiState('worklogComment', comment));
          }}
        />
        {screenshotsAllowed &&
          <div style={{ marginLeft: 10 }}>
            <Tooltip
              description="Screenshots are enabled"
              position="bottom"
            >
              <CameraIcon
                size="large"
                primaryColor="white"
                label="Screenshots on"
              />
            </Tooltip>
          </div>
        }
      </Flex>
      <Flex row alignCenter>
        <IssueName
          onClick={() => {
            dispatch(uiActions.setUiState(
              'selectedIssueId',
              trackingIssue.id,
            ));
          }}
        >
          {trackingIssue.key}
        </IssueName>
        <Dot />
        <Time>
          {getTimeString(time)}
        </Time>
      </Flex>
      <div
        onClick={() => {
          if (screenshotUploading) {
            // eslint-disable-next-line no-alert
            window.alert(
              'Currently app in process of uploading screenshot, wait few seconds please',
            );
          } else {
            dispatch(timerActions.stopTimerRequest());
          }
        }}
      >
        <StopButton
          alt="stop"
          onClick={() => {
            dispatch(timerActions.stopTimerRequest());
          }}
        />
      </div>
    </Container>
  </CSSTransitionGroup>
);

function mapStateToProps(state) {
  return {
    time: getTimerState('time')(state),
    screenshotUploading: false,
    screenshotsAllowed: false,
    trackingIssue: getTrackingIssue(state),
    worklogComment: getUiState('worklogComment')(state),
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(TrackingBar);
