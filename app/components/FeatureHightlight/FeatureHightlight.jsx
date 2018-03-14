import React from 'react';
import type {
  Node,
} from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'react-redux';
import Tooltip from '@atlaskit/tooltip';
import Lozenge from '@atlaskit/lozenge';
import { getUiState } from 'selectors';
import { uiActions } from 'actions';

type Props = {
  dispatch: Dispatch,
  children: Node,
  description: string,
  featuresAcknowleged: Array<string>,
  id: string,
};

const FeatureHighlight = ({
  dispatch,
  featuresAcknowleged,
  description,
  children,
  id,
}: Props) => (!featuresAcknowleged.includes(id)
  ? (
    <Tooltip
      content={description}
      onMouseOut={() => dispatch(uiActions.acknowlegdeFeature({ featureId: id }))}
      onBlur={() => dispatch(uiActions.acknowlegdeFeature({ featureId: id }))}
    >
      {children}
      <Lozenge appearance="new">
        New
      </Lozenge>
    </Tooltip>
  ) : (
    children
  ));

const connector = connect(
  state => ({
    featuresAcknowleged: getUiState('featuresAcknowleged')(state),
  }),
  dispatch => ({ dispatch }),
);

export default connector(FeatureHighlight);
