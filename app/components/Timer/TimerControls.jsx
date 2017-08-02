import React, { PropTypes } from 'react';

import Flex from '../Base/Flex/Flex';

import buttonDecoration from '../../assets/images/button-surrounding@2x.png';
import playIcon from '../../assets/images/play@2x.png';
import stopIcon from '../../assets/images/stop@2x.png';

const TimerControls = ({
  running, screenshotUploading,
  startTimer, stopTimer,
}) => (
  <Flex column centered className="TimerControls">
    <div className="TimerControls__button">
      <img
        src={buttonDecoration}
        className="button-decoration"
        alt="button-decoration"
      />
      <button
        className={`button button-${running ? 'stop' : 'play'}`}
        onClick={() => {
          if (running) {
            if (screenshotUploading) {
              // eslint-disable-next-line no-alert
              window.alert(
                'Currently app in process of uploading screenshot, wait few seconds please',
              );
            } else {
              stopTimer();
            }
          } else {
            startTimer();
          }
        }}
      >
        {running
          ? <img src={stopIcon} width={33} height={33} alt="stop" />
          : <img src={playIcon} width={32} height={39} alt="start" />
        }
      </button>
    </div>
  </Flex>
);

TimerControls.propTypes = {
  startTimer: PropTypes.func.isRequired,
  stopTimer: PropTypes.func.isRequired,

  running: PropTypes.bool.isRequired,
  screenshotUploading: PropTypes.bool.isRequired,
};

export default TimerControls;
