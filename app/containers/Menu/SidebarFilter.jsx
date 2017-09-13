// TODO: delete onFilterIconClick and delete state from Sidebar component
// TODO: hide if recent (??)
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { refresh, filter, search } from 'data/svg';

import * as issuesActions from '../../actions/issues';

import Flex from '../../components/Base/Flex/Flex';

import {
  SearchBar,
  SearchIcon,
  SearchInput,
  SearchOptions,
  RefreshIcon,
  FilterIcon,
} from './styled';


const SidebarFilter = ({
  searchValue, searchIssues, allowRefresh,
  clearIssues, fetchIssues, fetchRecentIssues, setIssuesSearchValue,
  fetchIssuesAllTypes,
  fetchIssuesAllStatuses,
  onFilterIconClick,
}) =>
  <Flex column centered >
    <SearchBar>
      <SearchIcon src={search} alt="" />
      <SearchInput
        placeholder="Search issue"
        type="text"
        value={searchValue}
        onChange={(ev) => {
          setIssuesSearchValue(ev.target.value);
          searchIssues();
        }}
      />
      <SearchOptions>
        <RefreshIcon
          src={refresh}
          alt=""
          onClick={() => {
            if (allowRefresh) {
              clearIssues();
              fetchRecentIssues();
              fetchIssues();
              fetchIssuesAllTypes();
              fetchIssuesAllStatuses();
            }
          }}
        />
        <FilterIcon
          src={filter}
          alt=""
          onClick={onFilterIconClick}
        />
      </SearchOptions>
    </SearchBar>
  </Flex>;

SidebarFilter.propTypes = {
  searchValue: PropTypes.string.isRequired,
  clearIssues: PropTypes.func.isRequired,
  fetchIssues: PropTypes.func.isRequired,
  fetchRecentIssues: PropTypes.func.isRequired,
  searchIssues: PropTypes.func.isRequired,
  setIssuesSearchValue: PropTypes.func.isRequired,
  allowRefresh: PropTypes.bool.isRequired,
  fetchIssuesAllTypes: PropTypes.func.isRequired,
  fetchIssuesAllStatuses: PropTypes.func.isRequired,
  onFilterIconClick: PropTypes.func.isRequired,
};

function mapStateToProps({ ui, issues }) {
  return {
    searchValue: issues.meta.searchValue,
    showingFilterCriteriaBlock: issues.meta.showingFilterCriteriaBlock,
    sidebarType: ui.sidebarType,
    allowRefresh: !issues.meta.fetching,
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(issuesActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarFilter);
