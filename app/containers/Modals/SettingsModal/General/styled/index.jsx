import styled from 'styled-components';


export const SettingsSectionContent = styled.div`
  margin-bottom: 30px;
`;

export const ContentLabel = styled.span`
  margin-left: 6px;
  margin-bottom: 10px;
  display: block;
  font-weight: 600;
  color: black;
`;

export const InputNumber = styled.input.attrs({
  type: 'number',
})`
  appearance: none;
  color: inherit;
  font-size: 16px;
  font-family: inherit;
  letter-spacing: inherit;

  background: transparent;
  border: 0;
  box-sizing: border-box;
  cursor: inherit;
  line-height: inherit;
  margin: 0;
  outline: none;
  padding: 0;
  width: 100%;
  :invalid {
    box-shadow: none;
  }
`;
