// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getTimerTime, getTrackingIssue, getScreenshotsAllowed } from 'selectors';
import { issuesActions, timerActions } from 'actions';
import { Flex } from 'components';
import { CSSTransitionGroup } from 'react-transition-group';
import moment from 'moment';
import CameraIcon from '@atlaskit/icon/glyph/camera';
import Tooltip from '@atlaskit/tooltip';

import WorklogEditDialog from './WorklogEditDialog';
import type { Issue, SelectIssue, StopTimerRequest } from '../../../types';
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
  selectIssue: SelectIssue,
  stopTimerRequest: StopTimerRequest,
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
  selectIssue,
  stopTimerRequest,
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
        <WorklogEditDialog />
        {screenshotsAllowed &&
          <div style={{ marginLeft: 10 }}>
            <Tooltip
              description="Screenshots are enabled"
              position="bottom"
            >
              <CameraIcon size="large" primaryColor="white" label="Screenshots on" />
            </Tooltip>
          </div>
        }
      </Flex>
      <Flex row alignCenter>
        <IssueName
          onClick={() => {
            selectIssue(trackingIssue);
            // jumpToTrackingIssue();
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
            stopTimerRequest();
          }
        }}
      >
        <StopButton
          alt="stop"
          onClick={() => stopTimerRequest()}
        />
      </div>
    </Container>
  </CSSTransitionGroup>
);

function mapStateToProps(state) {
  return {
    time: getTimerTime(state),
    screenshotUploading: false,
    screenshotsAllowed: getScreenshotsAllowed(state),
    trackingIssue: getTrackingIssue(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...issuesActions, ...timerActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackingBar);
