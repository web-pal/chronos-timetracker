import React, { PropTypes } from 'react';

const TimerDisplay = (props) => {
  const { time } = props;
  return (
    <div className="timer-display">
      {time}
    </div>
  );
};

TimerDisplay.propTypes = {
  time: PropTypes.number.isRequired,
};

export default TimerDisplay;
