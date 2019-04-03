// @flow
/* eslint-disable indent */
import styled from 'styled-components';

export const AppWrapper = styled.div`
  height: 100%;
  overflow: hidden;
`;

export const MaxHeight = styled.div`
  height: 100%;
`;

export const FullPageSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const CheckboxGroup = styled.div`
   display: flex;
   flex-direction: column;
`;

export const Flex = styled.div`
  display: flex;
  box-sizing: border-box;
  position: relative;
  text-align: start;
  flex-direction: ${props => (props.column ? 'column' : 'row')};
  flex-wrap: ${props => (props.wrap ? 'wrap' : 'nowrap')};
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: ${props => props.align || 'flex-start'};
  padding: ${props => props.paddingStr || '0px'};
  box-shadow: ${props => props.shadow || 'none'};
  margin: ${props => props.marginStr || '0px'};
  background: ${props => props.background || 'transparent'};
  pointer-events: ${props => props.pointerEvents || 'auto'};
  color: ${props => props.color || 'black'};
  cursor: ${props => props.cursor || 'normal'};
  ${props => props.fillSpace && `
    height: 100%;
    width: 100%;
    flex: 1 1 100%;
  `}
  ${props => props.height
    && `height: ${typeof props.height === 'number' ? `${props.height}px` : props.height}`
  };
  ${props => props.width
    && `width: ${typeof props.width === 'number' ? `${props.width}px` : props.width}`
  };
  ${props => props.padding
    && `padding: ${props.padding}`
  };
  ${props => props.margin
    && `margin: ${props.margin}`
  };
  & > *:not(:last-child) {
    margin-${props => (props.column ? 'bottom' : 'right')}: ${props => props.spacing || 0}px;
    margin-${props => (props.column ? 'right' : 'bottom')}: ${props => (props.wrap ? props.spacing || 0 : 0)}px;
  }
  ${props => props.grow
    && `flex-grow: ${props.grow}`
  };
  ${props => props.borderRadius
    && `border-radius: ${props.borderRadius}`
  };
  ${props => props.overflow && 'overflow: hidden'};

  ${props => props.border
    && `border: ${props.border}`
  };
  ${props => props.borderColor
    && `borderColor: ${props.borderColor}`
  };
  ${props => props.borderTop
    && `border-top: ${props.borderTop}`
  };
  ${props => props.borderBottom
    && `border-bottom: ${props.borderBottom}`
  };
  ${props => props.borderRight
    && `border-right: ${props.borderRight}`
  };
  ${props => props.borderLeft
    && `border-left: ${props.borderLeft}`
  };
  ${props => props.scroll
    && 'overflow: auto'
  };
  ${props => props.flex
    && `flex: ${props.flex}`
  };
  ${props => props.clickable
    && `
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
    `
  };
`;
