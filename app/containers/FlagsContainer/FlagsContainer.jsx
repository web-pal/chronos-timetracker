// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';
import type {
  Connector,
} from 'react-redux';
import type {
  Dispatch,
} from 'types';

import {
  uiActions,
} from 'actions';
import {
  getUiState,
} from 'selectors';

import {
  AutoDismissFlag as Flag,
  FlagGroup,
} from '@atlaskit/flag';

import EditorWarningIcon from '@atlaskit/icon/glyph/editor/warning';
import NotificationAllIcon from '@atlaskit/icon/glyph/notification-all';


type Props = {
  flags: any,
  dispatch: Dispatch,
}

function getIcon(iconName) {
  return iconName === 'errorIcon' ?
    <EditorWarningIcon label="huy" size="medium" primaryColor="red" /> :
    <NotificationAllIcon label="pizda" size="medium" primaryColor="blue" />;
}

const FlagsContainer: StatelessFunctionalComponent<Props> = ({
  flags,
  dispatch,
}: Props): Node => (
  <FlagGroup
    onDismissed={(id) => {
      dispatch(uiActions.deleteFlag(id));
    }}
  >
    {flags.map(flag => (
      <Flag
        key={flag.id}
        {...flag}
        icon={getIcon(flag.icon)}
      />
    ))}
  </FlagGroup>
);

function mapStateToProps(state) {
  return {
    flags: getUiState('flags')(state),
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(FlagsContainer);
