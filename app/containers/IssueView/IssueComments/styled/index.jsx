import styled from 'styled-components';
import styledOld from 'styled-components';
import FieldTextArea from '@atlaskit/field-text-area';

export const ActivitySection = styled.div`
`;

export const AddCommentContainer = styled.div`
`;

export const CommentInputContainer = styled.div`
  min-height: 60px;
  max-width: 340px;
  padding: 7px 8px;
  width: 100%;
  margin-left: 40px;
  margin-top: -20px;
`;

export const Actions = styled.div`
  padding: 10px 0px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
`;

export const AddCommentInput = styledOld(FieldTextArea)`
  transition: all 0.1s ease;
  box-sizing: border-box;
  background-color: #F4F5F7;
  border: 1px solid #DFE1E6;
  border-radius: 3px;
  resize: none;
`;

export const Mention = styled.a`
  padding-left: 4px;
  padding-right: 4px;
  border-radius: 10px;
  background-color: #edeff3;
  color: #0049CA;
  cursor: pointer;
`;

export const CommentInput = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

export const Commentd = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  :hover {
    background: #f4f5f7;
  }
`;

export const CommentDate = styled.span`
  color: #5E6C84;
  font-weight: 400;
`;

export const CommentBody = styled.span`
  color: #172B4D;
  font-weight: 400;
  margin-left: 48px;
  & > p, & > div, & > span {
    word-break: break-all;
  }
`;

export const CommentAvatar = styled.img`
  width: 32px;
  height: 32px;
  margin-right: 16px;
  border-radius: 50%;
  border: 1px solid white;
`;

export const CommentAuthor = styled.span`
  color: #505F79;
  font-weight: 500;
  padding-right: 8px;
`;

export const OptionsButton = styled.div`
  background-color: rgba(9, 30, 66, 0.06);
  border-radius: 3px;
  padding: 2px 4px;
  justify-content: center;
  align-items: center
  height: 20px;
  width: 28px;
  height: 14px;
  cursor: pointer;
  display: none;
  ${Commentd}:hover & {
    display: flex;
  }
  :hover {
    background-color: #253858;
    color: white;
  }
`;

export const Dots = styled.span`
  font-size: 20px;
  margin-top: -12px;
  fontWeigth: 600;
  height: 24px;
`;

export const YourComment = styled.span`
  color: #172B4D;
  font-size: 1.14285714rem;
  font-weight: 500;
  letter-spacing: -0.006em;
  line-height: 1.5;
`;
