import React, { PropTypes } from 'react';

import Flex from '../../Base/Flex/Flex';

/* eslint-disable no-nested-ternary */

const TimerControls = (props) => {
  const { start, stop, pause, unpause, running, paused } = props;
  return (
    <Flex row className="timer-controls">
      <button
        className={`button button-${running ? 'danger' : 'success'}`}
        onClick={running ? stop : start}
      >
        {running ? 'Stop' : 'Start' }
      </button>
      <button
        className={`button pause button-${running ? (paused ? 'info' : 'warning') : 'disabled'}`}
        onClick={paused ? unpause : pause}
      >
        {paused ? 'Unpause' : 'Pause'}
      </button>
    </Flex>
  );
};

TimerControls.propTypes = {
  running: PropTypes.bool.isRequired,
  paused: PropTypes.bool.isRequired,
  start: PropTypes.func.isRequired,
  pause: PropTypes.func.isRequired,
  unpause: PropTypes.func.isRequired,
  stop: PropTypes.func.isRequired,
};

export default TimerControls;
