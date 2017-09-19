import React, { Component } from 'react';
import moment from 'moment';
import { remote, ipcRenderer as ipc } from 'electron';
import { stj } from 'time-util';
import { stopwatch } from 'data/svg';

import {
  PopupContainer,
  StopwatchImage,
} from './styled';
import { Button } from '../../../styles/buttons';
import { H500 } from '../../../styles/typography';

import Flex from '../../Base/Flex/Flex';

import '../../../assets/stylesheets/main.less';

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
    ipc.send('keepIdleTime', this.state.idleTime);
    remote.getCurrentWindow().destroy();
  }

  render() {
    const { idleTime, date } = this.state;
    const awayFrom = date.clone().subtract(idleTime, 'ms').format('HH:mm');
    const awayTo = date.format('HH:mm');
    const awayFor = stj(idleTime / 1000, 'h [hours] m [minutes] s [seconds]');

    return (
      <PopupContainer>
        <H500 style={{ marginBottom: 10, marginTop: 10 }}>
          <StopwatchImage src={stopwatch} alt="" />
          Idle time alert
        </H500>
        <span>
          You were inactive from {awayFrom} to {awayTo} <b>({awayFor})</b>.
          <br />
          Do you want to keep this time?
        </span>
        <Flex row style={{ marginTop: 10, marginBottom: 10 }}>
          <Button
            background="hsla(40, 100%, 45%, 1)"
            style={{ marginRight: 5, width: 76 }}
            onClick={this.dismissTime}
          >
            Dismiss
          </Button>
          <Button
            background="#36B37E"
            style={{ width: 76 }}
            onClick={this.keepTime}
          >
            Keep
          </Button>
        </Flex>
      </PopupContainer>
    );
  }
}

export default IdlePopup;
