import React, { PropTypes } from 'react';

import Flex from '../Base/Flex/Flex';
import TimerDisplay from './TimerDisplay/TimerDisplay';
import TimerControls from './TimerControls/TimerControls';

const Timer = (props) => {
  const { time, running, paused, onStart, onStop, onPause, trackingIssue } = props;
  return (
    <Flex column centered className="timer">
      {trackingIssue.size
        ? <Flex row centered>
            <Flex column>
              <TimerDisplay time={time} />
              <TimerControls
                running={running}
                paused={paused}
                start={onStart}
                stop={onStop}
                pause={onPause}
              />
            </Flex>
          </Flex>
        : <Flex row centered>
            select an issue from the list on the left
          </Flex>
        }
      </Flex>
  );
};

Timer.propTypes = {
  trackingIssue: PropTypes.object.isRequired,
  time: PropTypes.number.isRequired,
  running: PropTypes.bool.isRequired,
  paused: PropTypes.bool.isRequired,
  onStart: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
};

export default Timer;
