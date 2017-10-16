import styled from 'styled-components';

export const IssueViewPlaceholderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  height: 100vh;
  border-left: 1px solid rgba(0, 0, 0, 0.18);
  background: hsla(0, 0%, 98%, 1);
`;
export const Title = styled.span`
  margin-top: 16px;
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
  width: 120px;
`;
