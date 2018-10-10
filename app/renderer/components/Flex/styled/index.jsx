import styled from 'styled-components';

export const Flex = styled.div`
  display: flex;
  flex-direction: ${props => (props.column ? 'column' : 'row')};
  flex-wrap: ${props => (props.wrap ? 'wrap' : 'nowrap')};
  align-items: ${(props) => {
    if (props.alignCenter) {
      return 'center';
    }
    if (props.alignEnd) {
      return 'flex-end';
    }
    if (props.alignStart) {
      return 'flex-start';
    }
    return props.alignItems || 'normal';
  }};
  justify-content: ${(props) => {
    if (props.justifyCenter) {
      return 'center';
    }
    if (props.spaceBetween) {
      return 'space-between';
    }
    if (props.spaceAround) {
      return 'space-around';
    }
    return props.justifyContent || 'normal';
  }};
`;
