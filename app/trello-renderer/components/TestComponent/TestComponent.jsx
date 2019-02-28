// @flow
import React from 'react';
import {
  useMappedState,
} from 'redux-react-hook';
import type {
  Node,
} from 'react';

import * as selectors from 'trello-selectors';

export type TestComponentProps = {
  /** Set if the button is disabled. */
  isDisabled: boolean,
  /** Change the style to indicate the button is selected. */
  isSelected: boolean,
};

const mapState: Props = state => ({
  userId: selectors.getUiState('trelloUserId')(state),
});

const TestComponet = (
  props: TestComponentProps,
): Node => {
  const {
    isDisabled,
    isSelected,
  } = props;
  const {
    userId,
  } = useMappedState(mapState);

  return (
    <div>
      User id: {userId}
    </div>
  );
};

TestComponet.defaultProps = {
  isDisabled: false,
  isSelected: false,
};

export default TestComponet;
