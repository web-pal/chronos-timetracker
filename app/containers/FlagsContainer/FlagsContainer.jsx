// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { uiActions } from 'actions';
import { AutoDismissFlag as Flag, FlagGroup } from '@atlaskit/flag';
import EditorWarningIcon from '@atlaskit/icon/glyph/editor/warning';
import NotificationAllIcon from '@atlaskit/icon/glyph/notification-all';

import type { FlagsArray, RemoveFlag } from '../../types';

type Props = {
  flags: FlagsArray,
  removeFlag: RemoveFlag,
}

function getIcon(iconName) {
  return iconName === 'errorIcon' ? <EditorWarningIcon label="huy" size="medium" primaryColor="red" /> : <NotificationAllIcon label="pizda" size="medium" primaryColor="blue" />;
}

const FlagsContainer: StatelessFunctionalComponent<Props> = ({
  flags,
  removeFlag,
}: Props): Node => (
  <FlagGroup onDismissed={removeFlag}>
    {flags.map((flag, i) => (
      <Flag
        key={i}
        {...flag}
        icon={getIcon(flag.icon)}
        onDismissed={() => {}}
        isDismissAllowed
      />
    ))}
  </FlagGroup>
);

function mapStateToProps(state) {
  return {
    flags: state.ui.flags,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(uiActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FlagsContainer);

