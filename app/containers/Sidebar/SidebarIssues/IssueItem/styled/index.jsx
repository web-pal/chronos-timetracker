import styled from 'styled-components2';
import {
  Flex,
} from 'components';


export const IssueContainer = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;

  height: 80px;
  padding: 10px 20px;
  border-bottom: 1px solid rgba(151, 151, 151, .35);
  ${props => props.active && `
    background-color: hsla(216, 78%, 96%, 1) !important;
    // border-bottom: 1px solid hsla(216, 48%, 76%, 1);
  `}
  :hover {
    background-color: hsla(216, 18%, 98%, 1);
  }
`;

export const IssueNameContainer = styled(Flex).attrs({
  row: true,
})`
  align-items: flex-end;
`;

export const IssueName = styled.a`
  font-weight: 700;
  color: ${props => props.theme.primary};
  font-size: 16px;
  cursor: pointer;
  margin-right: 5px;
`;

export const IssueDescription = styled.div`
  font-size: 13px;
`;

export const IssueFieldsContainer = styled(Flex).attrs({
  row: true,
})`
  margin-top: 8px;
`;

export const IssueType = styled.img`
  height: 16px;
`;

export const IssuePriority = styled.img`
  height: 16px;
  margin-left: 5px;
`;

export const IssueLabel = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  height: 16px;
  background: ${props => props.backgroundColor};
  border-radius: 3px;
  font-size: 12px;
  color: #FFFFFF;
  padding: 0px 4px;
  font-weight: 600;
`;

export const TimeLogged = styled.span`
  color: rgba(0, 0, 0, .7);
  margin-left: 8px;
  font-size: 13px;
  display: block;
  transform: translateY(-2px);
`;

