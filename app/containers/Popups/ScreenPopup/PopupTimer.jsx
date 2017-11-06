// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';

type Props = {
  time: number,
}

const PopupTimer: StatelessFunctionalComponent<Props> = ({
  time,
}: Props): Node =>
  <div className="popup-timer">
    <span>
      {time}
    </span>
  </div>;

export default PopupTimer;
