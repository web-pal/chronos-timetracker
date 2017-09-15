import styled from 'styled-components';

// padding top is 15px to avoid OS X window bar
// background-color: ${props => props.theme.primary};
export const HeaderContainer = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  min-height: 70px;
  padding: 15px 20px 0px 20px;
  background-image: linear-gradient(to top, #4778c1 0%, #0052CC 99%, #0052CC 100%)
`;

export const Name = styled.span`
  font-weight: 600;
  font-size: 16px;
`;

export const Team = styled.span`
  // cursor: pointer;
`;

export const DropdownSeparator = styled.div`
  width: 100%;
  height: 1px;
  background: #e1e4e9;
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
`;

export const SettingsIcon = styled.img`
  height: 26px;
  cursor: pointer;
  border-radius: 50%;
  transition: transform .5s ease-in-out;
  :hover {
    transform: rotate(180deg);
  }
`;

export const ProfilePicture = styled.img`
  height: 50px;
  transition: all .1s ease-in;
  margin-right: 5px;
  margin-left: 0px;
  :hover {
    margin-right: 2px;
    margin-left: -3px;
    height 56px;
    box-shadow:0 1px 4px rgba(0, 0, 0, 0.4), 0 0 40px rgba(0, 0, 0, 0.1) inset;
    border-radius: 50%;
}
  }
`;
