import styled from 'styled-components';

export const TimelineItem = styled.div`
  display: flex;
  flex-direction: row;
  width: 20px;
  height: 160px;
  min-height: 160px;
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
  font-weight: 600;
  margin-bottom: 5px;
`;
export const Screenshot = styled.img`
  height: 30px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.17);
  width: 100%;
  padding-bottom: 5px;
  margin-bottom: 15px;
`;
export const Worklog = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, .1);
  margin-right: 5px;
  align-items: center;
  width: 140px;
`;
export const WorklogTime = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #42526e;
`;
export const ActivityLineOuter = styled.div`
  border-radius: 6px;
  width: 100%;
  height: 6px;
  background: #e8e8e8;
  overflow: hidden;
  margin: 5px 0px;
`;
export const ActivityLineInner = styled.div`
  width: ${props => props.percent}%;
  background: rgba(169, 246, 20, 0.9);
  min-width: 3%;
  height: 100%;
`;
export const ActivityRecord = styled.div`
  font-weight: 500;
  font-size: 12px;
`;
export const ActivityContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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
