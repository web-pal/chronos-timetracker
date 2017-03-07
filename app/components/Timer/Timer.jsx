import React, { PropTypes } from 'react';

import DescriptionPopup from '../DescriptionPopup/DescriptionPopup';
import Flex from '../Base/Flex/Flex';
import TimerDisplay from './TimerDisplay/TimerDisplay';
import TimerControls from './TimerControls/TimerControls';

const Timer = (props) => {
  const {
    time, running, paused, onStart, onStop, onPause, onUnPause, currentIssue, setCurrentIssue,
    descPopupOpen, onDescPopupClose, onDescPopupConfirm, description, trackingIssue, uploading
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
            <DescriptionPopup
              open={descPopupOpen}
              onClose={onDescPopupClose}
              onConfirm={onDescPopupConfirm}
            />
            <TimerControls
              running={running}
              paused={paused}
              start={onStart}
              stop={onStop}
              pause={onPause}
              unpause={onUnPause}
            />
            <TimerDisplay time={time} uploading={uploading} />
            {description &&
              <Flex column centered>
                <Flex row centered className="description__label">
                  D E S C R I P T I O N
                </Flex>
                <Flex row centered className="description">
                  {description}
                </Flex>
              </Flex>
            }
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
  descPopupOpen: PropTypes.bool.isRequired,
  description: PropTypes.string,
  setCurrentIssue: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
  onUnPause: PropTypes.func.isRequired,
  onDescPopupClose: PropTypes.func.isRequired,
  onDescPopupConfirm: PropTypes.func.isRequired,
  uploading: PropTypes.bool.isRequired,
};

export default Timer;
