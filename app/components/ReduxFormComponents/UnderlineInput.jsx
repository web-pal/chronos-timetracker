// @flow
import React, { Component } from 'react';

import type {
  FieldProps,
} from 'redux-form';

import {
  UnderlineStyledInput,
} from './styled';

type Props = {
  input: FieldProps.input,
  autoFocus: boolean,
  type: string,
  placeholder: string,
};


class UnderlineInput extends Component<Props> {
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
      <UnderlineStyledInput
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

export default UnderlineInput;
