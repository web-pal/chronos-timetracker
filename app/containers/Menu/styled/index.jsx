import styled from 'styled-components';

export const SearchBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0px 20px;
  min-height: 38px;
  height: 38px;
  background-color: #F7FAFF;
  border-bottom: 1px solid hsla(217, 15%, 90%, 1);
`;

export const SearchIcon = styled.img`
  height: 18px;
`;

export const RefreshIcon = styled.img`
  height: 16px;
  cursor: pointer;
  transition: transform .3s ease-in;
  :hover {
    transform: rotate(270deg);
  }
`;

export const FilterIcon = styled.img`
  height: 16px;
  margin-left: 10px;
  cursor: pointer;
`;

export const SearchInput = styled.input`
  flex: 1;
  border-width: 0px;
  background-color: #F7FAFF;
  padding-left: 10px;
  font-size: 14px;
`;

export const SearchOptions = styled.div`
`;
