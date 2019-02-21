// @flow
import React from 'react';
import type {
  Node,
} from 'react';

export type TestComponentProps = {
  /** Set if the button is disabled. */
  isDisabled: boolean,
  /** Change the style to indicate the button is selected. */
  isSelected: boolean,
};

const TestComponet = (
  props: TestComponentProps,
): Node => {
  const {
    isDisabled,
    isSelected,
  } = props;
  return (
    <div>
      Test component
    </div>
  );
};

TestComponet.defaultProps = {
  isDisabled: false,
  isSelected: false,
};

export default TestComponet;
