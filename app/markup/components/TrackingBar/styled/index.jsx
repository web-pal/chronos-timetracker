import styled from 'styled-components';

export const TrackingBarContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-height: 67px;
  // background-color: #172B4D;
  background-image: linear-gradient(to bottom,#1a2942 0%,#172B4D 99%,#172B4D 100%);
  color: white;
  padding: 10px 20px;
`;

export const StartTimer = styled.img`
  width: 60px;
  border: 1px solid #4577c1;
  border-radius: 50%;
`;

export const TaskName = styled.span`
  font-size: 20px;
  margin-bottom: 5px;
  // color: #eaf3ff;
`;


export const StatsItem = styled.span`
  font-size: 12px;
  color: #e7e8ef;
`;

export const Timer = styled.span`
  font-size: 30px;
  font-weight: 600;
  margin-right: 10px;
`;

export const AddTime = styled.span`
  font-size: 12px;
  margin-top: -6px;
`;

