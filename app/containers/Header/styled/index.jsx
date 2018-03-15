import styled from 'styled-components2';
import {
  Flex,
} from 'components';
import {
  DropdownItem,
} from '@atlaskit/dropdown-menu';

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
  background: #0052CC;
  -webkit-app-region: drag;
`;

export const ProfileName = styled.span`
  font-weight: 600;
  font-size: 16px;
`;

export const ProfileTeam = styled.span`
  // cursor: pointer;
`;

export const DropdownSeparator = styled.div`
  width: 100%;
  height: 1px;
  background: #e1e4e9;
`;

export const ProfileContainer = styled(Flex).attrs({
  row: true,
  alignCenter: true,
})``;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
`;

export const RefreshIcon = styled.img`
  @keyframes rotating {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  height: 20px;
  cursor: pointer;
  // transition: transform .5s ease-in-out;
  transition: transform .3s ease-in;
  -webkit-app-region: drag;
  user-select: none;
  margin-top: 1px;
  margin-right: 8px;
  :hover {
    transform: rotate(270deg);
  }
  ${props => (props.isFetching ? `
    animation: rotating 0.8s linear infinite;
  ` : '')}
`;

export const SettingsIcon = styled.img`
  height: 22px;
  cursor: pointer;
  border-radius: 50%;
  transition: transform .5s ease-in-out;
  -webkit-app-region: drag;
  user-select: none;
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
  user-select: none;
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

export const IconsContainer = styled(Flex).attrs({
  row: true,
})`
  position: relative;
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

export const DropdownProgressBar = styled.div`
  width: 100%;
  height: 3px;
  position: relative;
  overflow: hidden;
  background-color: #ddd;
  :before {
    display: block;
    position: absolute;
    content: "";
    left: -200px;
    width: 200px;
    height: 3px;
    background-color: #FF8B00;
    animation: loading 1.5s linear infinite;
  }

  @keyframes loading {
    from {left: -200px; width: 30%;}
    50% {width: 30%;}
    70% {width: 70%;}
    80% { left: 50%;}
    95% {left: 120%;}
    to {left: 100%;}
  }
`;
