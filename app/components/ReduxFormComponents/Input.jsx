// @flow
import React, { Component } from 'react';

import type {
  FieldProps,
} from 'redux-form';

import {
  StyledInput,
} from './styled';

type Props = {
  autoFocus: boolean,
  type: string,
  placeholder: string,
} & FieldProps;


class Input extends Component<Props> {
  input = null;

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
