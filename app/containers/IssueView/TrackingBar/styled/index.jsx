import styled from 'styled-components';

// background: #32A675 !important;
// background: #172B4D !important;
// background: linear-gradient(to right, rgb(255, 209, 72), rgb(255, 204, 77)) !important;
export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  min-height: 60px;
  padding: 15px 20px 10px 20px;
  background: #172B4D !important;
  color: white;
`;

export const NavButton = styled.img`
  height: 20px;
  cursor: pointer;
  transition: transform .2s ease-in-out;
  transform: ${props => !props.isTrackingView ? 'rotate(0deg)' : 'rotate(180deg)'};
`;

export const IssueName = styled.span`
  font-size: 24px;
  font-weight: 400;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-weight: 300;
  letter-spacing: 0.5px;
  border-bottom: 2px solid white;
  :hover {
    color: hsla(0, 0%, 80%, 1);
    border-color: hsla(0, 0%, 85%, 1);
  }
`;
export const Dot = styled.div`
  width: 5px;
  height: 5px;
  background: white;
  margin: 0px 10px;
  border-radius: 50%;
`;
export const Time = styled.span`
  font-size: 22px;
  letter-spacing: 1px;
  font-weight: 700;
`;
export const StopButton = styled.img`
  height: 60px;
  cursor: pointer;
`;
export const StartButton = styled.img`
  height: 60px;
  cursor: pointer;
`;
