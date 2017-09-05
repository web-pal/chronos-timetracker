import styled from 'styled-components';

export const TrackingBarContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-height: 60px;
  padding: 16px 20px;
  color: hsla(216, 80%, 30%, 1);
  border-bottom: 1px solid hsla(220, 24%, 87%, 1);
  background: linear-gradient(to right, rgb(255, 209, 72), hsl(43, 99%, 65%)) !important;
`;

export const StartTimer = styled.img`
  width: 60px;
  border-radius: 50%;
`;

export const TaskName = styled.span`
  font-size: 20px;
  margin-bottom: 3px;
  font-weight: 600;
  color: hsla(218, 54%, 30%, 1);
`;


export const Timer = styled.span`
  font-size: 30px;
  font-weight: 600;
  margin-right: 10px;
`;

export const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 1px 12px;
  margin-top: 5px;
  height: 20px;
  width: 40px;

  color: hsla(218, 54%, 25%, 1);
  background-color: hsla(43, 95%, 65%, 1);

  border: 1px solid hsla(218, 54%, 25%, 1);
  border-radius: 3px;

  letter-spacing: 0.5px;
  font-size: 12px;
  font-weight: 500;

  cursor: pointer;

  :hover {
    background-color: #1a2943;
    color: #f2d488;
  }
`;

