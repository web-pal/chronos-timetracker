import React, { PropTypes } from 'react';
import moment from 'moment';

function addLeadingZero(s) {
  return s < 10 ? `0${s}` : s;
}

const TimerDisplay = (props) => {
  const time = moment.duration(props.time * 1000);
  const timeString =
    `${addLeadingZero(time.hours())}:\
${addLeadingZero(time.minutes())}:\
${addLeadingZero(time.seconds())}`;
  return (
    <div className="timer-display">
      {timeString}
    </div>
  );
};

TimerDisplay.propTypes = {
  time: PropTypes.number.isRequired,
};

export default TimerDisplay;
