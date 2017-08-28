import styled from 'styled-components';

export const NavBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  min-height: 50px;
  padding: 0px 20px;
  border-bottom: 1px solid rgba(151, 151, 151, .45);
`;

export const BackIcon = styled.img`
  border-radius: 50%;
  padding: 5px;
  width: 14px;
  height: 14px;
  cursor: pointer;
  :hover {
    background-color: rgba(151, 151, 151, .15)
  }
`;

export const Title = styled.span`
  font-weight: 500;
`;

export const Action = styled.a`
  color: ${props => props.theme.primary};
  cursor: pointer;
`;
