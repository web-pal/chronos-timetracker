import styled from 'styled-components';
import UserAvatarCircleIcon from '@atlaskit/icon/glyph/user-avatar-circle';

import { play, playHover } from 'utils/data/svg';

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

export const ActionButton = styled.button`
  // background: #f5f5f5;
  // border: 1px solid #ccc;
  // color: #333;
  border-radius: 3px;
  margin-right: 5px;
  cursor: pointer;
  font-size: 12px;
  border: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px 12px;
  background: rgba(9, 30, 66, 0.04);
  color: #505F79;
  :hover {
    background: rgba(9, 30, 66, 0.08);
  }
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

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
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

export const IssueViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #fff;
  position: relative;
  width: ~"calc(100% - 320px)";
`;

export const IssueContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 1px solid rgba(0,0,0,0.18);
  flex-grow: 1;
`;

export const IssueViewTabContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 20px 0px 20px;
  overflow-y: auto;
  flex-grow: 1;
`;

export const IssueViewHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 16px 20px;
  min-height: 102px;
  height: 102px;
`;
