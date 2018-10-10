/* eslint-disable no-confusing-arrow */
import styled from 'styled-components';
import { atlassianLogoVertical } from 'utils/data/svg';

export const ReportTabContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-grow: 1;
  background-color: #0052CC;
  margin: -20px -20px auto -20px;
  padding: 32px 0;
`;

export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  flex-grow: 1;
`;

export const MetaColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 40%;
  padding-right: 16px;
  min-width: 240px;
  flex-grow: 1;
  max-width: 260px;
`;

export const MetaItemName = styled.span.attrs({
  className: 'MetaItemName',
})`
  color: rgba(225, 225, 225, .9);
  font-size: 14px;
`;

export const MetaItemValue = styled.span.attrs({
  className: 'MetaItemValue',
})`
  color: white;
  font-size: 28px;
`;

export const CTAButton = styled.div`
  background: #FFAB00;
  border-radius: 3px;
  font-size: 18px;
  color: #091E42;
  letter-spacing: 0.6px;
  padding: 8px 16px;
  margin-top: 8px;
  cursor: pointer;
  :hover {
    background: #FF991F;
    border-color: #FF991F;
    color: #172B4D;
  }
`;

export const CTAArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Heading = styled.div`
  font-size: 24px;
  text-align: center;
  color: #FFFFFF;
`;

export const HelpText = styled.a`
  color: rgba(255,255,255,0.85);
  font-size: 12px;
  cursor: pointer;
  :hover {
    color: white;
  }
`;

export const BorderLeft = styled.div`
  width: 4px;
  background: ${props => props.color};
`;

export const ChronosDescriptionMetaItem = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 4px;
  b {
    color: white;
  }
`;

export const ChronosDescription = styled.div`
  font-size: 10px;
  color: rgba(225, 225, 225, .85);
  text-align: center;
  max-width: 95%;
  margin-top: 5px;
  b {
    color: white;
  }
`;

export const ChronosTimesheetsScreenshot = styled.div`

`;

export const ClockMetaItem = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 4px;
`;

export const Clock = styled.div`
  border-radius: 50%;
  background-color: #0962E8;
  width: 30px;
  height: 30px;
`;

export const AtlassianLogoMetaItem = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const AtlassianLogo = styled.img.attrs({
  src: atlassianLogoVertical,
})`
  width: 90px;
`;

export const BackgroundShape = styled.div`
  ${(props) => {
    switch (props.number) {
      case 1:
        return `
          height: 20px;
          bottom: 32px;
        `;
      case 2:
        return `
          height: 80px;
          bottom: 60px;
        `;
      case 3:
        return `
          height: 60px;
          bottom: 152px;
        `;
      case 4:
        return `
          height: 140px;
          bottom: 232px;
        `;
      default:
        return '';
    }
  }}
  position: absolute;
  left: 20px;
  border-radius: 10px;
  width: 20px;
  background-color: ${props => props.color};
  opacity: ${props => props.opacity};
`;


export const LearnMoreLink = styled.a`
  text-decoration: none;
  font-size: 10px;
  color: white;
  cursor: pointer;
  :hover {
    color: white;
  }
`;
