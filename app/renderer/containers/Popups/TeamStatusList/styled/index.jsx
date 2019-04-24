import styled from 'styled-components';
import SettingsIconAK from '@atlaskit/icon/glyph/settings';
import EditIconAK from '@atlaskit/icon/glyph/edit';

export const TeamStatusListWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #FAFBFC;
  color: #172B4D;
`;

export const TeamMembersWrapper = styled.div`
  height: 285px;
  overflow-y: auto;
`;

export const NoTeamSelectedText = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const TeamMemberItemWrapper = styled.div`
  display: flex;
  background-color: #FAFBFC;
  border-top: 2px solid #F4F5F7;
  border-bottom: 2px solid #F4F5F7;
  padding: 5px;
  &:first-child {
    margin-top: 2px;
    border-top: none;
  }
  &:last-child {
    border-bottom: 4px solid #F4F5F7;
  }
`;

export const UserAvatar = styled.img`
  height: 48px;
  width: 48px;
  border: 2px solid white;
  border-radius: 50%;
  transition: all .1s ease-in;
  user-select: none;
  :hover {
    box-shadow:0 1px 4px rgba(0, 0, 0, 0.4), 0 0 40px rgba(0, 0, 0, 0.1) inset;
    border-radius: 50%;
  }
`;

export const UserInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 30%;
  padding: 0px 5px;
`;

export const UserName = styled.span`
  font-weight: bold;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 160px;

  &:hover {
    white-space: initial;
  }
`;

export const UserLocation = styled.span`
  font-size: 12px;
  color: #8993A4;
`;

export const Status = styled.span``;

export const LastDate = styled.span`
  flex: 0 0 29%;
`;

export const FooterToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 5px 5px;
`;

export const EditIcon = styled(EditIconAK)`
  width: 20px;
  height: 20px;
`;

export const TeamName = styled.span`
  font-weight: bold;
`;

export const SettingsIcon = styled(SettingsIconAK)`
  width: 20px;
  height: 20px;
`;
