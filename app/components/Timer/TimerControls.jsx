import React, { PropTypes } from 'react';

import Flex from '../Base/Flex/Flex';

import buttonDecoration from '../../assets/images/button-surrounding@2x.png';
import playIcon from '../../assets/images/play@2x.png';
import stopIcon from '../../assets/images/stop@2x.png';

const TimerControls = (props) => {
  const { startTimer, stopTimer, running } = props;
  return (
    <Flex row centered className="TimerControls">
      <div className="TimerControls__button">
        <img
          src={buttonDecoration}
          className="button-decoration"
          alt="button-decoration"
        />
        <button
          className={`button button-${running ? 'stop' : 'play'}`}
          onClick={running ? stopTimer : startTimer}
        >
          {running
            ? <img src={stopIcon} width={33} height={33} alt="stop" />
            : <img src={playIcon} width={32} height={39} alt="start" />
          }
        </button>
      </div>
    </Flex>
  );
};

TimerControls.propTypes = {
  startTimer: PropTypes.func.isRequired,
  stopTimer: PropTypes.func.isRequired,

  running: PropTypes.bool.isRequired,
};

export default TimerControls;
