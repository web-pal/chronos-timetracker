import React, { Component } from 'react';
import moment from 'moment';
import { remote, ipcRenderer as ipc } from 'electron';

import Flex from '../components/Base/Flex/Flex';
import { stj } from '../helpers/time';

import '../assets/stylesheets/main.less';

const { getGlobal } = remote;

class IdlePopup extends Component {
  constructor(props) {
    super(props);
    const { idleTime } = getGlobal('sharedObj');
    this.state = {
      idleTime,
      date: moment(),
    };
  }

  dismissTime = () => {
    ipc.send('dismissIdleTime', this.state.idleTime);
    remote.getCurrentWindow().destroy();
  }

  keepTime = () => {
    remote.getCurrentWindow().destroy();
  }

  dismissAndRestart = () => {
    ipc.send('dismissAndRestart', this.state.idleTime);
    remote.getCurrentWindow().destroy();
  }

  render() {
    const { idleTime, date } = this.state;
    return (
      <Flex column className="IdlePopup">
        <Flex row centered>
          <span>
            You was inactive for {stj(idleTime / 1000, 'h[h] m[m] s[s]')} <br />
            From {date.clone().subtract(idleTime, 'ms').format('HH:mm')} to
            {date.format('HH:mm:ss')}
          </span>
        </Flex>
        <Flex column>
          <button
            className="button button-info"
            onClick={this.dismissTime}
          >
            Dismiss
          </button>
          <button
            className="button button-info"
            onClick={this.keepTime}
          >
            Keep
          </button>
        </Flex>
      </Flex>
    );
  }
}

export default IdlePopup;
