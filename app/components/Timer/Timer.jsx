import React, { PropTypes } from 'react';

import DescriptionPopup from '../DescriptionPopup/DescriptionPopup';
import Flex from '../Base/Flex/Flex';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';

const Timer = (props) => {
  const {
    time, running, paused, onStart, onStop, onPause, onUnPause, currentIssue, setCurrentIssue,
    description, trackingIssue, uploading, onDescriptionChange, startTimer, stopTimer,
  } = props;
  return (
    <Flex column centered className="timer">
      <Flex row centered>
        <Flex column>
          <TimerControls
            running={running}
            paused={paused}
            startTimer={startTimer}
            stopTimer={stopTimer}
            pause={onPause}
            unpause={onUnPause}
          />
          <TimerDisplay
            time={time}
            uploading={uploading}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

Timer.propTypes = {
  currentIssue: PropTypes.object.isRequired,
  trackingIssue: PropTypes.object,
  time: PropTypes.number.isRequired,
  running: PropTypes.bool.isRequired,
  paused: PropTypes.bool.isRequired,
  description: PropTypes.string,
  setCurrentIssue: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
  onUnPause: PropTypes.func.isRequired,
  uploading: PropTypes.bool.isRequired,
  onDescriptionChange: PropTypes.func.isRequired,
};

export default Timer;
