import React, { PropTypes } from 'react';

import DescriptionPopup from '../DescriptionPopup/DescriptionPopup';
import Flex from '../Base/Flex/Flex';
import TimerDisplay from './TimerDisplay/TimerDisplay';
import TimerControls from './TimerControls/TimerControls';

const Timer = (props) => {
  const {
    time, running, paused, onStart, onStop, onPause, onUnPause, trackingIssue,
    descPopupOpen, onDescPopupClose, onDescPopupConfirm, description,
  } = props;
  return (
    <Flex column centered className="timer">
      {trackingIssue.size
        ? <Flex row centered>
          <Flex column>
            <DescriptionPopup
              open={descPopupOpen}
              onClose={onDescPopupClose}
              onConfirm={onDescPopupConfirm}
            />
            <TimerDisplay time={time} />
            <TimerControls
              running={running}
              paused={paused}
              start={onStart}
              stop={onStop}
              pause={onPause}
              unpause={onUnPause}
            />
            <Flex row centered className="description">
              {description}
            </Flex>
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
  descPopupOpen: PropTypes.bool.isRequired,
  description: PropTypes.string,
  onStart: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
  onUnPause: PropTypes.func.isRequired,
  onDescPopupClose: PropTypes.func.isRequired,
  onDescPopupConfirm: PropTypes.func.isRequired,
};

export default Timer;
