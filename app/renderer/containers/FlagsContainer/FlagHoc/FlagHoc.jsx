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
  resourceType: string,
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
      (props.resourceType && props.request) ?
        getResourceStatus(
          state,
          `${props.resourceType}.requests.${props.request}.status`,
          true,
        ).pending :
        false,
  };
}

const connector: Connector<{
  render: (pending: boolean) => Node,
  resourceType: string,
  request: string,
}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(FlagHoc);
