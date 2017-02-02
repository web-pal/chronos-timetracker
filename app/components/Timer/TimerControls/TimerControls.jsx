import React, { PropTypes } from 'react';

import Flex from '../../Base/Flex/Flex';

/* eslint-disable no-nested-ternary */

const TimerControls = (props) => {
  const { start, stop, pause, unpause, running, paused } = props;
  return (
    <Flex row centered className="timer-controls">
      <button
        className={`button button-${running ? 'stop' : 'play'}`}
        onClick={running ? stop : start}
      >
        {running ? <span className="fa fa-stop" /> : <span className="fa fa-play" /> }
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
