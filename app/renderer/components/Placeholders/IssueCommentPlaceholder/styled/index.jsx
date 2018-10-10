import styled from 'styled-components';
import { AnimatedPlaceholder } from '../../styled';

export const PlaceholderContainer = styled.div`
  padding: 10px;
`;

export const Placeholder = styled(AnimatedPlaceholder)`
  background: #fff;
  position: absolute;
${(props) => {
    switch (props.type) {
      case 'avatar':
        return `
          border-radius: 50%;
          width: 32px !important;
          height: 32px !important;
          top: 0px;
          left: 0px;
        `;
      case 'title':
        return `
          width: 100px !important;
          height: 14px !important;
          left: 10px;
        `;
      case 'body':
        return `
          height: 14px !important;
          width: 230px !important;
          margin: 5px 0px;
        `;
      case 'body2':
        return `
          height: 14px !important;
          width: 350px !important;
          margin: 5px 0px;
        `;
      case 'body3':
        return `
          height: 14px !important;
          width: 50px !important;
          margin: 5px 0px;
        `;
      default:
        return '';
    }
  }}
`;

