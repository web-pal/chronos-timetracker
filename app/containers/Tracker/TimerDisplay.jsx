import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import moment from 'moment';

function addLeadingZero(s) {
  return s < 10 ? `0${s}` : s;
}

const TimerDisplay = ({ time, uploading }) => {
  const timeMoment = moment.duration(time * 1000);
  const timeString = [
    `${timeMoment.hours() ? `${addLeadingZero(timeMoment.hours())}:` : ''}`,
    `${addLeadingZero(timeMoment.minutes())}:${addLeadingZero(timeMoment.seconds())}`,
  ].join('');
  return (
    <div className="timer-display">
      {uploading ?
        <span className="uploading">Uploading</span> :
        timeString
      }
    </div>
  );
};

TimerDisplay.propTypes = {
  time: PropTypes.number.isRequired,
  uploading: PropTypes.bool.isRequired,
};

function mapStateToProps({ timer, worklogs }) {
  return {
    time: timer.time,
    uploading: worklogs.meta.worklogUploading,
  };
}

export default connect(mapStateToProps)(TimerDisplay);
