import React, { PropTypes } from 'react';

import Flex from '../../Base/Flex/Flex';

import buttonDecoration from '../../../assets/images/button-surrounding.png';
import playIcon from '../../../assets/images/play.png';
import stopIcon from '../../../assets/images/stop.png';

/* eslint-disable no-nested-ternary */

const TimerControls = (props) => {
  const { start, stop, pause, unpause, running, paused } = props;
  return (
    <Flex row centered className="TimerControls">
      <div className="TimerControls__button">
        <img src={buttonDecoration} className="button-decoration" />
        <button
          className={`button button-${running ? 'stop' : 'play'}`}
          onClick={running ? stop : start}
        >
          {running
            ? <img src={stopIcon} />
            : <img src={playIcon} />
          }
      </button>
      </div>
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
