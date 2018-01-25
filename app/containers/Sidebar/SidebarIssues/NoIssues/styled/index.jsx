import styled from 'styled-components2';
import {
  Flex,
} from 'components';


export const NoIssuesContainer = styled(Flex).attrs({
  column: true,
  justifyCenter: true,
  alignCenter: true,
})`
  width: 100%;
  height: 100%;
  flex: 1 0 100%;
`;

export const Title = styled.span`
  margin-top: 10px;
  color: #172b4d;
  font-size: 24px;
  font-weight: 500;
  font-style: normal;
  line-height: 24px;
  letter-spacing: -0.24px;
`;
export const Subtitle = styled.span`
  margin-bottom: 20px;
  margin: 6px;
  color: #172b4d;
  font-size: 14px;
  font-weight: 400;
  font-style: normal;
  line-height: 20px;
`;
export const NoIssuesImage = styled.img`
  width: 140px;
`;

