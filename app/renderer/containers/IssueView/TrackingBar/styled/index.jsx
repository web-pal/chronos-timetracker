import styled from 'styled-components';
import EditFilledIcon from '@atlaskit/icon/glyph/edit-filled';
import {
  stop, stopHover,
} from 'utils/data/svg';

// background: #32A675 !important;
// background: #172B4D !important;
// background: linear-gradient(to right, rgb(255, 209, 72), rgb(255, 204, 77)) !important;
export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: #172B4D !important;
  color: white;
  padding: 15px 20px 10px 20px;
  height: 60px;
`;

export const EditButton = styled(EditFilledIcon)`
  cursor: pointer;
  background: white;
  height: 27px;
  width: 27px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 2px solid white;
  padding: 2px;
`;

export const EditButtonContainer = styled.div`
  cursor: pointer;
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
    color: hsla(219, 77%, 89%, 1);
    border-color: hsla(219, 77%, 89%, 1);
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
export const StopButton = styled.div`
  height: 60px;
  width: 60px;
  cursor: pointer;
  background-size: cover;
  background-image: url(${stop});
  :hover {
    background-image: url(${stopHover});
  }
`;
export const StartButton = styled.img`
  height: 60px;
  cursor: pointer;
`;
