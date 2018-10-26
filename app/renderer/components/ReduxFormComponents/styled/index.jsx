import styled from 'styled-components';


export const UnderlineStyledInput = styled.input`
  width: calc(100% - 10px);
  height: 40px;
  min-height: 40px;
  font-size: 14px;
  letter-spacing: 0;
  color: #091E42;
  background: white;
  border: 0px;
  border-bottom: 2px solid #0052cc;
  border-radius: 0px;
  padding: 0px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 40px;
  &::-webkit-input-placeholder {
    font-size: 14px;
  }
  &:focus {
    border-color: hsla(216, 49%, 43%, 1);
  }
`;

export const StyledInput = styled.input`
  width: calc(100% - 10px);
  height: 40px;
  min-height: 40px;
  padding-left: 10px;
  margin-bottom: 10px;

  font-size: 14px;
  letter-spacing: 0;

  background-color: #FAFBFC;
  border: 1px solid #F4F5F7;
  border-radius: 5px;
  color: #091E42;

  &::-webkit-input-placeholder {
    font-size: 14px;
  }
  &:hover {
    background-color: #F4F5F7;
    border-color: #F4F5F7;
  }
  &:focus {
    border-color: #4C9AFF;
    border-width: 2px;
    height: 38px;
    min-height: 38px;
    padding-left: 9px;
    background: white;
  }
`;
