import styled from 'styled-components';

export const ProjectAvatar = styled.img`
  width: 48px;
  height: 48px;
  margin-right: 5px;
`;

export const UserAvatar = styled.img`
  width: 24px;
  height: 24px;
  position: absolute;
  margin-top: 12px;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 -4px 8px 0 rgba(9, 30, 66, 0.25);
  background-color: #0052CC;
`;

export const Link = styled.a`
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

export const StartButton = styled.img`
  width: 60px;
  height: 60px;
  cursor: pointer;
  border-radius: 50%;
  :hover {
    box-shadow: 0 4px 8px 0 rgba(9, 30, 66, 0.32);
  }
`;

export const StartButtonPlaceholder = styled.div`
  width: 60px;
  height: 60px;
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
