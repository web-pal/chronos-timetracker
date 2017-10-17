// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { uiActions } from 'actions';
import { AutoDismissFlag as Flag, FlagGroup } from '@atlaskit/flag';
import type { FlagsArray, RemoveFlag } from '../../types';

type Props = {
  flags: FlagsArray,
  removeFlag: RemoveFlag,
}

const FlagsContainer: StatelessFunctionalComponent<Props> = ({
  flags,
  removeFlag,
}: Props): Node => (
  <FlagGroup onDismissed={removeFlag}>
    {flags.map(flag => (
      <Flag {...flag} />
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

