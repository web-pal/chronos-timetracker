// @flow
import React, {
  Component,
} from 'react';


import type {
  FieldProps,
} from 'redux-form';

import {
  FormGroup,
  StyledInput,
  Error,
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
      meta,
      input,
      autoFocus,
      type,
      placeholder,
    } = this.props;
    return (
      <FormGroup>
        <StyledInput
          {...input}
          innerRef={(el) => {
            this.input = el;
          }}
          type={type}
          autoFocus={autoFocus}
          placeholder={placeholder}
        />
        {meta.touched && meta.error && <Error>{meta.error}</Error>}
      </FormGroup>
    );
  }
}

export default Input;
