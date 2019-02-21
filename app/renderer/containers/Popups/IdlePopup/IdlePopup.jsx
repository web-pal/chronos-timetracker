import React from 'react';
import moment from 'moment';
import {
  remote,
} from 'electron';

import {
  stj,
} from 'utils/time-util';
import Flag from '@atlaskit/flag';
import RecentIcon from '@atlaskit/icon/glyph/recent';

import {
  timerActions,
} from 'actions';

import configureStore from '../../../store/configurePreloadStore';
import * as S from './styled';


const system = remote.require('desktop-idle');
const store = configureStore();
const idleTime = system.getIdleTime();
const date = moment();
const awayFrom = date.clone().subtract(idleTime, 'ms').format('HH:mm');
const awayTo = date.format('HH:mm');
const awayFor = stj(idleTime, 'h [hours] m [minutes] s [seconds]');

const IdlePopup = () => (
  <S.Popup>
    <Flag
      icon={(
        <RecentIcon
          label="Idle time popup"
          size="medium"
        />
      )}
      actions={[
        {
          content: 'Keep',
          onClick: () => {
            store.dispatch(timerActions.keepIdleTime(idleTime));
          },
        },
        {
          content: 'Dissmiss',
          onClick: () => {
            store.dispatch(timerActions.dismissIdleTime(idleTime));
          },
        },
      ]}
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
  </S.Popup>
);

export default IdlePopup;
