import styled from 'styled-components';

export const Bar = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 10px;
  font-size: 12px;
`;
export const BarLabel = styled.span`
  color: rgb(112,112,112);
`;
export const BarValue = styled.span`
`;
export const ProgressBar = styled.div`
  background: ${props => props.color};
  height: 10px;
  border-radius: 4px;
`;
