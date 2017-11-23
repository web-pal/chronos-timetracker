import styled from 'styled-components2';

export const TextInput = styled.input`
  padding: 0 8px;
  height: 36px;
  background-color: #FFF;
  box-shadow: inset 0 1px 3px #EBECF0;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  line-height: normal;
  margin-bottom: 16px;
  max-width: none;
  width: 95%;
  background: #FFF;
  color: #253858;
`;
export const FeedbackTextarea = styled.textarea`
  padding: 10px 8px;
  background-color: #FFF;
  background: #FFF;
  color: #253858;
  box-shadow: inset 0 1px 3px #EBECF0;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  line-height: normal;
  margin-bottom: 16px;
  max-width: none;
  width: 95%;
  height: 120px;
`;
export const AttachmentsButton = styled.div`
  cursor: pointer;
  font-weight: 400;
  color: #FFF;
  background-color: #97A0AF;
  font-size: 12px;
  line-height: 1;
  padding: 6px 7px 6px 5px;
  width: 114px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  :hover {
    background-color: #505F79;
  }
`;
export const AttachmentsIcon = styled.img`
  height: 14px;
  margin-right: 3px;
`;
