// @flow
import React, { Component } from 'react';
import moment from 'moment';
import {
  remote,
  ipcRenderer as ipc,
} from 'electron';
import Flag from '@atlaskit/flag';
import RecentIcon from '@atlaskit/icon/glyph/recent';

import type Moment from 'moment';

import {
  stj,
} from 'utils/time-util';

import {
  PopupContainer,
} from './styled';

import '../../../assets/stylesheets/main.less';

const {
  getGlobal,
} = remote;

type State = {
  idleTime: number,
  date: Moment,
};

class IdlePopup extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    const { idleTime } = getGlobal('sharedObj');
    this.state = {
      idleTime,
      date: moment(),
    };
  }

  dismissTime = () => {
    ipc.send('dismiss-idle-time', this.state.idleTime);
    remote.getCurrentWindow().destroy();
  }

  keepTime = () => {
    ipc.send('keep-idle-time', this.state.idleTime);
    remote.getCurrentWindow().destroy();
  }

  render() {
    const { idleTime, date } = this.state;
    const awayFrom: string = date.clone().subtract(idleTime, 'ms').format('HH:mm');
    const awayTo: string = date.format('HH:mm');
    const awayFor: string = stj(idleTime / 1000, 'h [hours] m [minutes] s [seconds]');

    const actions = [
      { content: 'Keep', onClick: this.keepTime },
      { content: 'Dissmiss', onClick: this.dismissTime },
    ];

    return (
      <PopupContainer>
        <Flag
          icon={(
            <RecentIcon
              label="Idle time popup"
              size="medium"
            />
          )}
          actions={actions}
          id="Idle-time-popup"
          title="Idle time alert"
          description={(
            <div>
              {`Your were inactive from ${awayFrom} to ${awayTo} `}(<b>{awayFor}</b>).
              <br />
              Do you want to keep this time?
            </div>
          )}
        />
      </PopupContainer>
    );
  }
}

export default IdlePopup;
