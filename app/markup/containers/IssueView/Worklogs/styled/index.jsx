import styled from 'styled-components';

export const TimelineItem = styled.div`
  display: flex;
  flex-direction: row;
  width: 20px;
  height: 100px;
  min-height: 100px;
`;

export const TimelineLineContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20px;
  margin-right: 10px;
`;

export const TimelineCircle = styled.div`
  width: 12px;
  height: 12px;
  min-height: 12px;
  border-radius: 50%;
  border: 3px solid #195fc8;
`;

export const TimelineLine = styled.div`
  width: 2px;
  height: 100%;
  background-color: #195fc8;
`;

export const Time = styled.span`
`;
export const Screenshot = styled.div`
`;
export const Worklog = styled.div`
`;
export const WorklogTime = styled.div`
`;
export const ActivityLine = styled.div`
`;
export const ActivityRecord = styled.div`
`;
export const ActivityContainer = styled.div`
`;
export const Button = styled.div`
  border: 2px solid ${props => props.theme.primary};
  color: ${props => props.theme.primary};
  border-radius: 3px;
  padding: 2px 3px;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 3px;
  padding: 3px 12px;
  margin-left: 10px;
  font-size: 12px;
  cursor: pointer;
  font-weight: 500;
  :hover {
    background-color: ${props => props.theme.primary};
    color: white;
  }
`;
