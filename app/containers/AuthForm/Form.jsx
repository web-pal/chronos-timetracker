import React, { Component } from 'react';
import styled from 'styled-components';
import { findDOMNode } from 'react-dom';
import Flex from '../../components/Base/Flex/Flex';

import calculateSize from 'calculate-size';
console.log(calculateSize);

const InputMaskValue = styled.div`
  position: absolute;
  top: 10px;
  font-size: 14px;
  font-weight: 500;
  z-index: -1;
`;

const InputMask = styled.span`
  position: absolute;
  top: 10px;
  color: hsla(216, 77%, 23%, 1);
  left: ${props => (!!props.offSet && props.offSet + 1) || 34}px;
`;

const Input = styled.input`
  width: calc(100% - 10px);
  height: 40px;
  min-height: 40px;
  padding-left: 10px;
  margin-bottom: 10px;

  background: white;
  border: 2px solid hsla(217, 20%, 80%, 1);
  border-radius: 3px;

  font-size: 14px;
  letter-spacing: 0;

  &::-webkit-input-placeholder {
    font-size: 14px;
  }
  &:focus {
    border-color: hsla(216, 49%, 43%, 1);
  }
  &:hover {
    border-color: hsla(216, 49%, 43%, 1);
  }
`;

const UnderlineInput = Input.extend`
  border: 0px;
  border-bottom: 2px solid #0052cc;
  border-radius: 0px;
  padding: 0px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 40px;
`;

class MaskField extends Component {
  state = { width: 56 };

  onInputChange = (ev) => {
    const size = calculateSize(ev.target.value, {
      font: 'system-ui',
      fontSize: '14px',
      fontWeight: '500',
    });
    this.setState({ width: size.width });
  }

  render() {
    /* eslint-disable react/prop-types */
    const {
      style, underlined, mask, input, label, type,
      placeholder, meta: { touched, error, warning }
    } = this.props;
    const { width } = this.state;
    /* eslint-enable react/prop-types */

    return (
      <Flex row spaceBetween style={{ width: '100%', position: 'relative' }}>
        {underlined ?
          <UnderlineInput
            {...input}
            type={type}
            style={style || {}}
            placeholder={placeholder}
            onChange={(value) => {
              this.onInputChange(value);
              input.onChange(value);
            }}
          />
          :
          <Input
            {...input}
            type={type}
            style={style || {}}
            placeholder={placeholder}
          />
        }
        {/* mask &&
          <InputMaskValue ref={r => { this.r = r; }}>
            {input.value}
          </InputMaskValue>
        */}
        {mask &&
          <InputMask offSet={width}>
            .atlassian.net
          </InputMask>
        }
      </Flex>
    );
  }
}

export const renderField = (props) => <MaskField {...props} />;
