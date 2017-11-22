import styled from 'styled-components2';

export const FiltersContainer = styled.div`
  position: absolute;
  background: white;
  z-index: 10;
  height: calc(100% - 39px);
  top: 39px;
  width: 435px;
`;

export const FilterItems = styled.div`
  overflow-y: auto;
  height: calc(100% - 64px);
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
  height: 14px;
  margin-right: 3px;
`;

export const OptionLabel = styled.span`
  display: flex;
  align-items: center;
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

export const OptionContainer = styled.label`
  width: 50%;
  display: inline-block;
`;

export const FilterActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-top: 1px solid rgb(225, 228, 233);
`;

export const IssuesFoundText = styled.div`
  height: 23px;
  display: flex;
  align-items: center;
  font-size: 11px;
  font-weight: 500;
  color: #5e6c84;
`;
