import styled from 'styled-components';
import { DropdownItem } from '@atlaskit/dropdown-menu';

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
  background-image: linear-gradient(to top, #4778c1 0%, #0052CC 99%, #0052CC 100%);
  -webkit-app-region: drag;
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
  -webkit-app-region: drag;
  :hover {
    transform: rotate(180deg);
  }
`;

export const ProfilePicture = styled.img`
  height: 48px;
  width: 48px;
  border: 2px solid white;
  border-radius: 50%;
  transition: all .1s ease-in;
  margin-right: 10px;
  margin-left: 0px;
  -webkit-app-region: drag;
  :hover {
    margin-right: 7px;
    margin-left: -3px;
    height 56px;
    width 56px;
    box-shadow:0 1px 4px rgba(0, 0, 0, 0.4), 0 0 40px rgba(0, 0, 0, 0.1) inset;
    border-radius: 50%;
}
  }
`;

export const UpdateAvailableBadge = styled.div`
  width: 8px;
  height: 8px;
  background: #FF8B00;
  position: absolute;
  border-radius: 50%;
  right: -3px;
  top: -3px;
  border: 2px solid #1d61c7;
  z-index: 2;
`;

export const DropdownLogoutItem = styled(DropdownItem)`
  :hover {
    color: hsla(0, 90%, 55%, 1) !important;
  }
`;

export const DropdownUpdateItem = styled(DropdownItem)`
  color: #FF8B00 !important;
  :hover {
    background-color: hsla(33, 80%, 95%, 1) !important;
    color: #FF8B00 !important;
  }
`;
