import React, { PureComponent } from 'react';
import Input from '@atlaskit/input';
import { FieldBaseStateless } from '@atlaskit/field-base';

/* eslint-disable react/prop-types */
export default class extends PureComponent {
  static defaultProps = {
    onChange: () => {},
    onFocus: () => {},
    onBlur: () => {},
  }

  state = {
    value: this.props.value,
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
    });
  }

  handleOnChange = (e) => {
    this.setState({ value: e.target.value });
    this.props.onChange(e);
  }

  focus = () => {
    this.input.inputRef.focus();
  }

  render() {
    return (
      <FieldBaseStateless
        {...this.props}
      >
        <Input
          isEditing
          ref={(fieldRef) => { this.input = fieldRef; }}
          onChange={this.handleOnChange}
          value={this.state.value}
        />
      </FieldBaseStateless>
    );
  }
}
