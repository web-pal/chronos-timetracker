import styled from 'styled-components';
import UserAvatarCircleIcon from '@atlaskit/icon/glyph/user-avatar-circle';

import {
  play,
  playHover,
} from 'utils/data/svg';


export const ProjectAvatar = styled.img`
  width: 48px;
  height: 48px;
  margin-right: 5px;
  user-select: none;
`;

export const UserAvatarContainer = styled.div`
  width: 20px;
  height: 20px;
  position: absolute;
  margin-top: 12px;
  box-shadow: 0px 0px 5px 4px rgba(9,30,66,0.25);
  border: 2px solid white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0052cc;
`;

export const UserSampleAvatar = styled(UserAvatarCircleIcon)`
`;

export const UserAvatar = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  user-select: none;
`;

export const ALink = styled.a`
  cursor: pointer;
`;

export const Breadcrumb = styled.span`
  padding: 0px 8px;
`;

export const StartButton = styled.div`
  width: 60px;
  height: 60px;
  cursor: pointer;
  border-radius: 50%;
  background-image: url(${play});
  user-select: none;
  background-size: cover;
  :hover {
    background-image: url(${playHover});
  }
`;

export const StartButtonPlaceholder = styled.div`
  width: 60px;
  height: 60px;
  user-select: none;
`;

export const IssueSummary = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: calc(100vw - 589px);
  margin-right: 10px;
  margin-top: -5px;
  font-size: 24px;
  display: block;
`;

export const IssueViewHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 16px 20px;
  min-height: 102px;
  height: 102px;
`;
