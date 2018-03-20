import styled from 'styled-components';

export const PlaceholderContainer = styled.div`
  border-bottom: 1px solid rgba(151,151,151,.35);
  height: 160px;
  max-height: 80px;
  padding: 10px 20px;
`;

export const Placeholder = styled.div`
  background: #fff;
  position: absolute;
${(props) => {
    switch (props.type) {
      case 'issueRight':
        return `
          width: auto;
          right: 0;
          top: 0px;
          height: 18px;
          left: 94px;
        `;
      case 'issueBottom':
        return `
          width: auto;
          top: 18px;
          left: 0;
          right: 0;
          height: 8px;
        `;
      case 'descriptionRight':
        return `
          top: 26px;
          left: 380px;
          width: auto;
          right: 0;
          height: 12px;
        `;
      case 'descriptionBottom':
        return `
          width: auto;
          right: 0;
          height: 4px;
          left: 0;
          top: 38px;
        `;
      case 'descriptionRightSecond':
        return `
          top: 42px;
          left: 300px;
          width: auto;
          right: 0;
          height: 12px;
        `;
      case 'descriptionBottomSecond':
        return `
          width: auto;
          right: 0;
          height: 14px;
          top: 54px;
          left: 0;
        `;
      case 'attributesRight':
        return `
          width: auto;
          right: 0;
          top: 66px;
          height: 14px;
          left: 160px;
        `;
      case 'attributesBottom':
        return `
          width: auto;
          top: 68px;
          left: 140px;
          right: 0;
          height: 14px;
        `;
      default:
        return '';
    }
  }}
`;
