import styled from 'styled-components';

const baseInput = styled.input`
  width: calc(100% - 10px);
  height: 40px;
  min-height: 40px;

  color: #091E42;
  font-size: 14px;
  letter-spacing: 0;

  &::-webkit-input-placeholder {
    font-size: 14px;
  }
`;


export const UnderlineStyledInput = styled(baseInput)`
  background: white;
  border: 0px;
  border-bottom: 2px solid #0052cc;
  border-radius: 0px;
  padding: 0px;
  font-weight: 500;

  &:focus {
    border-color: hsla(216, 49%, 43%, 1);
  }
`;

export const StyledInput = styled(baseInput)`
  padding-left: 10px;

  background-color: #FAFBFC;
  border: 1px solid #F4F5F7;
  border-radius: 5px;
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

export const FormGroup = styled.div`
  width: 100%;
  margin-bottom: 10px;
`;

export const Error = styled.div`
  color: #DE350B;
  align-self: left;
  font-size: 12px;
  margin-top: 5px;
`;
