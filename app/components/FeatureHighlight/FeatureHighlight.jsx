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

import { FeatureContainer } from './styled';

type Props = {
  dispatch: Dispatch,
  children: Node,
  description: string,
  acknowlegdedFeatures: Array<string>,
  id: string,
};

const FeatureHighlight = ({
  dispatch,
  acknowlegdedFeatures,
  description,
  children,
  id,
}: Props) => (!acknowlegdedFeatures.includes(id)
  ? (
    <Tooltip
      content={description}
    >
      <FeatureContainer
        onClick={() => dispatch(uiActions.acknowlegdeFeature({ featureId: 'multiAccounts' }))}
      >
        {children}
        <Lozenge appearance="new">New</Lozenge>
      </FeatureContainer>
    </Tooltip>
  ) : (
    children
  ));

const connector = connect(
  state => ({
    acknowlegdedFeatures: getUiState('acknowlegdedFeatures')(state),
  }),
  dispatch => ({ dispatch }),
);

export default connector(FeatureHighlight);
