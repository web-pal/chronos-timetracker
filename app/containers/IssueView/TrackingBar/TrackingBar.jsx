import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import moment from 'moment';
import { arrowDownWhite, stopWhite, startWhite } from 'data/svg';
import Flex from '../../../components/Base/Flex/Flex';
import {
  NavButton,
  IssueName,
  Dot,
  Time,
  StopButton,
  StartButton,
  Container,
} from './styled';

function addLeadingZero(s) {
  return s < 10 ? `0${s}` : s;
}

const TrackingBar = ({
  toggleTrackingView,
  isTrackingView,
  startTimer,
  stopTimer,
  running,
  screenshotUploading,
  time,
  currentTrackingIssue,
  uploading, // TODO: get rid of uploading
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
        onClick={toggleTrackingView}
        isTrackingView={isTrackingView}
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
          if (running) {
            if (screenshotUploading) {
              // eslint-disable-next-line no-alert
              window.alert(
                'Currently app in process of uploading screenshot, wait few seconds please',
              );
            } else {
              stopTimer();
            }
          } else {
            startTimer();
          }
        }}
      >
        {running ?
          <StopButton
            src={stopWhite}
            alt="stop"
            onClick={stopTimer}
          /> :
          <StartButton
            src={startWhite}
            alt="start"
            onClick={startTimer}
          />
        }
      </div>
    </Container>
  );
};

TrackingBar.propTypes = {
  startTimer: PropTypes.func.isRequired,
  stopTimer: PropTypes.func.isRequired,

  running: PropTypes.bool.isRequired,
  screenshotUploading: PropTypes.bool.isRequired,

  time: PropTypes.number.isRequired,
  uploading: PropTypes.bool.isRequired,

  toggleTrackingView: PropTypes.func.isRequired,
  isTrackingView: PropTypes.bool.isRequired,

  currentTrackingIssue: ImmutablePropTypes.map.isRequired,
};

function mapStateToProps({ timer, worklogs }) {
  return {
    time: timer.time,
    uploading: worklogs.meta.worklogUploading,
  };
}

export default connect(mapStateToProps)(TrackingBar);
