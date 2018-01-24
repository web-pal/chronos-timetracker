import styled from 'styled-components2';
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

export const RefreshIcon = styled.img`
  @keyframes rotating {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  height: 16px;
  margin-bottom: 2px;
  margin-right: 4px;
  cursor: pointer;
  transition: transform .3s ease-in;
  :hover {
    transform: rotate(270deg);
  }
  ${props => (props.isFetching ? `
    animation: rotating 0.8s linear infinite;
  ` : '')}
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

export const RadioContainer = styled.div`
  width: 50%;
  display: inline-block;
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

export const TabContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-height: 51px;
`;

export const Tab = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 51px;
  min-height: 51px;
  width: 100%;
  color: white;
  background-color: white;
  border-bottom: 2px solid ${props => (props.active ? props.theme.primary : '#E1E4E9')};
  color: ${props => (props.active ? props.theme.primary : '#42526E')};
  font-weight: 500;
  cursor: pointer;
  :hover {
    color: ${props => props.theme.primary};
  }
`;

export const TabIcon = styled.img`
  height: 14px;
  margin-right: 5px;
`;

export const SidebarNothingSelected = styled.span`
  text-align: center;
  color: rgba(0, 0, 0, 0.67);
  margin-top: 25px;
`;

export const SidebarContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  max-width: 435px;
  background: #fff;
`;

export const SidebarList = styled.div`
  display: flex;
  flex-flow: column nowrap;
  word-break: normal;
  word-wrap: break-word;
  position: relative;
  list-style: none;
  margin: 0;
  height: 100%;
`;
