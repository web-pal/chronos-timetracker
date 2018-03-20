import styled from 'styled-components';
import ClickOutside from 'react-click-outside';

export const CalendarContainer = styled(ClickOutside)`
  margin-top: 5px;
  position: absolute;
  z-index: 2; // bigger than rc-time-picker popup
`;

export const CalendarIconContainer = styled.div`
  margin-left: -30px;
  margin-top: 2px;
  cursor: pointer;
`;

export const InputLabel = styled.div`
  color: #6B778C;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.3333333333333333;
  padding: 20px 0px 4px 0px;
`;

export const InputExample = styled.span`
  margin-left: 5px;
`;
