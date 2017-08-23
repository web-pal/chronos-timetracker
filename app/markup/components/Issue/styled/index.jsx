import styled from 'styled-components';

export const Issue = styled.div`
  border-bottom: 2px solid rgba(151, 151, 151, .35);
  min-height: 80px;
  height: 80px;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  :first-child>img {
    opacity: 0.05;
  }
`;

export const IssueLink = styled.img`
  margin-left: 5px;
  cursor: pointer;
`;

export const IssueName = styled.a`
  font-weight: 700;
  color: ${props => props.theme.primary};
  font-size: 16px;
  cursor: pointer;
`;

export const IssueDescription = styled.div`
`;

export const IssueType = styled.img`
  height: 16px;
`;

export const IssuePriority = styled.img`
  height: 16px;
  margin-left: 5px;
`;

export const IssueLabel = styled.span`
  margin-left: 5px;
  height: 16px;
  background: #4778C1;
  border-radius: 3px;
  font-size: 12px;
  color: #FFFFFF;
  padding: 0px 4px;
  font-weight: 600;
`;

export const StartTimerButton = styled.img`
  width: 80px;
  cursor: pointer;
  opacity: 0;
  ${Issue}:hover & {
    opacity: 1;
  }
`;

