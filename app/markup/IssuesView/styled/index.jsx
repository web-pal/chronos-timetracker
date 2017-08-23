import styled from 'styled-components';

export const Header = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  background-color: ${props => props.theme.primary};
  padding: 0px 20px;
`;
