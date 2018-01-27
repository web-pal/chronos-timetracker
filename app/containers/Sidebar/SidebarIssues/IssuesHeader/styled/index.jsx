import styled from 'styled-components2';
import AddIconAK from '@atlaskit/icon/glyph/add';
import FilterIconAK from '@atlaskit/icon/glyph/filter';
import SearchIconAK from '@atlaskit/icon/glyph/search';

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

export const SearchIcon = styled(SearchIconAK)`
  height: 18px;
`;

export const AddIcon = styled(AddIconAK)`
  height: 16px;
  margin-left: 5px;
  cursor: pointer;
`;

export const FilterIcon = styled(FilterIconAK)`
  height: 16px;
  margin-left: 5px;
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

export const FiltersAppliedBadge = styled.div`
  width: 8px;
  height: 8px;
  background: #0052cc;
  position: absolute;
  border-radius: 50%;
  right: 11px;
  top: 6px;
  border: 2px solid white;
`;

