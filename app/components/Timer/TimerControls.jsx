import React, { PropTypes, Component } from 'react';
import { ipcRenderer } from 'electron';

import Flex from '../Base/Flex/Flex';

import buttonDecoration from '../../assets/images/button-surrounding@2x.png';
import playIcon from '../../assets/images/play@2x.png';
import stopIcon from '../../assets/images/stop@2x.png';

class TimerControls extends Component {
  componentDidMount() {
    ipcRenderer.on('tray-start-click', this.startTimer);
    ipcRenderer.on('tray-stop-click', this.stopTimer);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('tray-start-click', this.startTimer);
    ipcRenderer.removeListener('tray-stop-click', this.stopTimer);
  }

  startTimer = () => {
    this.props.startTimer();
  }

  stopTimer = () => {
    if (this.props.screenshotUploading) {
      // eslint-disable-next-line no-alert
      window.alert(
        'Currently app in process of uploading screenshot, wait few seconds please',
      );
    } else {
      this.props.stopTimer();
    }
  }

  render() {
    const { running } = this.props;

    return (
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
                this.stopTimer();
              } else {
                this.startTimer();
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
  }
}

TimerControls.propTypes = {
  startTimer: PropTypes.func.isRequired,
  stopTimer: PropTypes.func.isRequired,

  running: PropTypes.bool.isRequired,
  screenshotUploading: PropTypes.bool.isRequired,
};

export default TimerControls;
