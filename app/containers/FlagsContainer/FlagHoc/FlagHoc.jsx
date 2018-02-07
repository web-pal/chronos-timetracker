// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';
import {
  getStatus as getResourceStatus,
} from 'redux-resource';

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

type Props = {
  flags: Array<any>,
  dispatch: Dispatch,
}

const FlagHoc: StatelessFunctionalComponent<Props> = ({
  pending,
  render,
}: Props): Node =>
  render(pending);

function mapStateToProps(state, props) {
  return {
    pending:
      (props.resourceName && props.request) ?
        getResourceStatus(
          state,
          `${props.resourceName}.requests.${props.request}.status`,
          true,
        ).pending :
        false,
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(FlagHoc);
