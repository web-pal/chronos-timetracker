// @flow
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


type Props = {
  pending: boolean,
  render: (pending: boolean) => Node,
  resourceName: string,
  request: string,
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

const connector: Connector<{
  render: (pending: boolean) => Node,
  resourceName: string,
  request: string,
}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(FlagHoc);
