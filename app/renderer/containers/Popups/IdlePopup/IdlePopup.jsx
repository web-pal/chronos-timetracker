import React from 'react';
import {
  connect,
} from 'react-redux';
import moment from 'moment';

import {
  stj,
} from 'utils/time-util';
import Flag from '@atlaskit/flag';
import RecentIcon from '@atlaskit/icon/glyph/recent';

import {
  timerActions,
} from 'actions';

import * as S from './styled';

const date = moment();

const IdlePopup = ({
  time,
  dispatch,
}) => {
  const awayFrom = date.clone().subtract(time, 's').format('HH:mm');
  const awayTo = moment().format('HH:mm');
  const awayFor = stj(time, 'h [hours] m [minutes] s [seconds]');
  return (
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
              dispatch(timerActions.keepIdleTime(time));
            },
          },
          {
            content: 'Dissmiss',
            onClick: () => {
              dispatch(timerActions.dismissIdleTime(time));
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
};

function mapStateToProps(state) {
  return {
    time: state.timer.time,
  };
}

const connector = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(IdlePopup);
