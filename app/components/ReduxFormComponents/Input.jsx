// @flow
import React, { Component } from 'react';

import type {
  FieldProps,
} from 'redux-form';

import {
  StyledInput,
} from './styled';

type Props = {
  input: FieldProps.input,
  autoFocus: boolean,
  type: string,
  placeholder: string,
};


class Input extends Component<Props> {
  constructor(props) {
    super(props);
    this.input = null;
  }

  render() {
    const {
      input,
      autoFocus,
      type,
      placeholder,
    } = this.props;
    return (
      <StyledInput
        {...input}
        innerRef={(el) => {
          this.input = el;
        }}
        type={type}
        autoFocus={autoFocus}
        placeholder={placeholder}
      />
    );
  }
}

export default Input;
