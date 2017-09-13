import styled from 'styled-components';

export const Filters = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FilterItems = styled.div`
  overflow-y: auto;
  height: calc(100vh - 265px);
`;

export const FilterItem = styled.div`
  border-bottom: 2px solid rgba(151, 151, 151, .15);
  padding-bottom: 20px;
`;

export const FilterTitle = styled.div`
  color: #6c798f;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.33333333;
  padding: 20px 0 4px 10px;
`;

export const FilterOptions = styled.div`
  padding-left: 10px;
`;

export const OptionImage = styled.img`
  height: 12px;
  margin-right: 3px;
`;

export const Option = styled.div`
`;

export const RadioButton = styled.input`
  opacity: 0;
  position: absolute;
  pointer-events: none;
`;

export const OptionLabel = styled.label`
`;
export const StatusOptionLabel = styled.label`
  color: ${props => props.color};
  background-color: ${props => props.bgColor};
  padding: 2px 4px 3px 4px;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  border-radius: 3px;
`;

// Custom Radio Button
export const CRBContainer = styled.span`
  padding: 0 7px;
  position: relative;
`;

export const CRBInput = styled.input`
  opacity: 0;
  position: absolute;
  pointer-events: none;
`;

export const CRBRadioCheckedOuter = styled.span`
  background-color: #0052CC;
  border-width: 1px;
  border-style: solid;
  border-color: #0052CC;
  border-radius: 50%;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  cursor: pointer;
  display: inline-block;
  height: 12px;
  margin: 2px;
  position: relative;
  vertical-align: middle;
  width: 12px;
  :hover {
    background-color: #0747A6;
    border-color: #0747A6;
  }
`;

export const CRBRadioCheckedInner = styled.div`
  background-color: white;
  border-radius: 50%;
  display: block;
  height: 4px;
  left: 3px;
  position: absolute;
  top: 3px;
  width: 4px;
`;

export const CRBRadioUnchecked = styled.div`
  background-color: #F4F5F7;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(9, 30, 66, 0.08);
  border-radius: 50%;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  cursor: pointer;
  display: inline-block;
  height: 12px;
  margin: 2px;
  position: relative;
  vertical-align: middle;
  width: 12px;
  :hover {
    background-color: #DFE1E6;
    border-width: 1px;
    border-style: solid;
    border-color: #A5ADBA;
    border-radius: 50%;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    cursor: pointer;
    display: inline-block;
    height: 12px;
    margin: 2px;
    position: relative;
    vertical-align: middle;
    width: 12px; 
  }
`;

// Radio Option
export const RadioContainer = styled.label`
  width: 50%;
  display: inline-block;
`;
