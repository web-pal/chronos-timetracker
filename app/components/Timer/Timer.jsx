import React, { PropTypes } from 'react';

import DescriptionPopup from '../DescriptionPopup/DescriptionPopup';
import Flex from '../Base/Flex/Flex';
import TimerDisplay from './TimerDisplay/TimerDisplay';
import TimerControls from './TimerControls/TimerControls';

const Timer = (props) => {
  const {
    time, running, paused, onStart, onStop, onPause, onUnPause, currentIssue, setCurrentIssue,
    description, trackingIssue, uploading, onDescriptionChange
  } = props;
  return (
    <Flex column centered className="timer">
      {currentIssue.size
        ? <Flex row centered>
          <Flex column>
            {trackingIssue.size !== 0 &&
                <Flex
                  column
                  className={`current-tracking\
 ${trackingIssue.get('id') !== currentIssue.get('id') ? 'show' : 'hide'}`}
                >
                <Flex row centered>
                  Currently tracking
                  <span
                    className="current-tracking__key"
                  >
                    {trackingIssue.get('key')}
                  </span>
                </Flex>
                <Flex row centered>
                  <span
                    className="current-tracking__link"
                    onClick={() => setCurrentIssue(trackingIssue)}
                  >
                    Jump to issue
                  </span>
                </Flex>
              </Flex>
            }
            {running &&
              <Flex row centered>
                <input
                  value={description}
                  className="descriptionInput"
                  onChange={(e) => onDescriptionChange(e.target.value)}
                  placeholder="What are you doing?"
                />
              </Flex>
            }
            <TimerControls
              running={running}
              paused={paused}
              start={onStart}
              stop={onStop}
              pause={onPause}
              unpause={onUnPause}
            />
            <TimerDisplay time={time} uploading={uploading} />
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
