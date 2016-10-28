import React, { PropTypes } from 'react';

const TimerControls = (props) => {
  const { start, stop, running } = props;
  return (
    <div className="timer-controls">
      <button
        className={`button button-${running ? 'danger' : 'success'}`}
        onClick={running ? stop : start}
      >
        {running ? 'Stop' : 'Start' }
      </button>
    </div>
  );
};

TimerControls.propTypes = {
  start: PropTypes.func.isRequired,
  stop: PropTypes.func.isRequired,
  running: PropTypes.bool.isRequired,
};

export default TimerControls;
