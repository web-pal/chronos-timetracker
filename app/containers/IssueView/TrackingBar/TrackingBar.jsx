import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { arrowDownWhite, stopWhite } from 'data/svg';
import Flex from '../../../components/Base/Flex/Flex';
import {
  NavButton,
  IssueName,
  Dot,
  Time,
  StopButton,
  Container,
} from './styled';

import * as timerActions from '../../../actions/timer';
import * as issuesActions from '../../../actions/issues';
import * as uiActions from '../../../actions/ui';

import { getTrackingIssue } from '../../../selectors';

function addLeadingZero(s) {
  return s < 10 ? `0${s}` : s;
}

const TrackingBar = ({
  setShowTrackingView,
  showTrackingView,
  stopTimerRequest,
  screenshotUploading,
  time,
  currentTrackingIssue,
  selectIssue,
  jumpToTrackingIssue,
}) => {
  const timeMoment = moment.duration(time * 1000);
  const timeString = [
    `${timeMoment.hours() ? `${addLeadingZero(timeMoment.hours())}:` : ''}`,
    `${addLeadingZero(timeMoment.minutes())}:${addLeadingZero(timeMoment.seconds())}`,
  ].join('');

  return (
    <Container>
      <NavButton
        src={arrowDownWhite}
        alt=""
        onClick={() => setShowTrackingView(!showTrackingView)}
        isTrackingView={showTrackingView}
      />
      <Flex row alignCenter>
        <IssueName
          onClick={() => {
            selectIssue(currentTrackingIssue.get('id'));
            jumpToTrackingIssue();
          }}
        >
          {currentTrackingIssue.get('key')}
        </IssueName>
        <Dot />
        <Time>
          {timeString}
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
          src={stopWhite}
          alt="stop"
          onClick={stopTimerRequest}
        />
      </div>
    </Container>
  );
};

TrackingBar.propTypes = {
  stopTimerRequest: PropTypes.func.isRequired,
  selectIssue: PropTypes.func.isRequired,
  jumpToTrackingIssue: PropTypes.func.isRequired,

  screenshotUploading: PropTypes.bool.isRequired,
  time: PropTypes.number.isRequired,
  currentTrackingIssue: ImmutablePropTypes.map.isRequired,

  setShowTrackingView: PropTypes.func.isRequired,
  showTrackingView: PropTypes.bool.isRequired,
};

function mapStateToProps({ timer, worklogs, issues, ui }) {
  return {
    time: timer.time,
    screenshotUploading: worklogs.meta.screenshotUploading,
    currentTrackingIssue: getTrackingIssue({ issues, worklogs }),
    showTrackingView: ui.showTrackingView,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...timerActions,
    ...issuesActions,
    ...uiActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackingBar);
