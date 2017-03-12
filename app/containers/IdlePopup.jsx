import React, { Component } from 'react';
import moment from 'moment';
import { remote, ipcRenderer as ipc } from 'electron';
import { stj } from 'time-util';

import Flex from '../components/Base/Flex/Flex';

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
        <Flex column>
          <span>
            You was inactive for <b>{stj(idleTime / 1000, 'h [hours] m [minutes] s [seconds]')}</b>
          </span>
          <span>
            From <b>{date.clone().subtract(idleTime, 'ms').format('HH:mm')}</b> to&nbsp;
            <b>{date.format('HH:mm')}</b>
          </span>
        </Flex>
        <Flex row>
          <button
            className="button button-info"
            onClick={this.keepTime}
          >
            Keep
          </button>
          <button
            className="button button-primary"
            onClick={this.dismissTime}
          >
            Dismiss
          </button>
        </Flex>
      </Flex>
    );
  }
}

export default IdlePopup;
