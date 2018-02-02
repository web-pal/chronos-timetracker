// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';
import {
  bindActionCreators,
} from 'redux';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

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

import type {
  FlagsArray,
  RemoveFlag,
} from '../../types';


type Props = {
  flags: FlagsArray,
  removeFlag: RemoveFlag,
}

function getIcon(iconName) {
  return iconName === 'errorIcon' ?
    <EditorWarningIcon label="huy" size="medium" primaryColor="red" /> :
    <NotificationAllIcon label="pizda" size="medium" primaryColor="blue" />;
}

const FlagsContainer: StatelessFunctionalComponent<Props> = ({
  flags,
  deleteFlag,
}: Props): Node => (
  <FlagGroup
    onDismissed={id => deleteFlag(id)}
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators(uiActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FlagsContainer);
