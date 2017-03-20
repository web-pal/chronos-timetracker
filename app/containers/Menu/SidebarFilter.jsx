import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as issuesActions from '../../actions/issues';

import Flex from '../../components/Base/Flex/Flex';

import searchIcon from '../../assets/images/search@2x.png';
import refreshIcon from '../../assets/images/refresh@2x.png';


const SidebarFilter = ({
  searchValue, sidebarType, searchIssues,
  clearIssues, fetchIssues, setIssuesSearchValue,
}) =>
  <Flex row className={`sidebar-filter-item ${sidebarType === 'Recent' ? 'hidden' : ''}`}>
    <Flex column centered className="search-field">
      <Flex column centered>
        {(searchValue.length > 0) &&
          <span
            className="aui-icon aui-icon-small aui-iconfont-remove-label"
            onClick={() => setIssuesSearchValue('')}
          />
        }
        <img
          src={searchIcon}
          width={18}
          height={18}
          alt="searchIcon"
        />
      </Flex>
      <input
        className="text"
        type="text"
        value={searchValue}
        onChange={(ev) => {
          setIssuesSearchValue(ev.target.value);
          searchIssues();
        }}
      />
    </Flex>
    <Flex column centered>
      <img
        className="refreshIcon"
        alt="refreshIcon"
        src={refreshIcon}
        onClick={() => {
          clearIssues();
          fetchIssues();
        }}
        width={20}
        height={19}
      />
    </Flex>
  </Flex>;

SidebarFilter.propTypes = {
  searchValue: PropTypes.string.isRequired,
  sidebarType: PropTypes.string.isRequired,
  clearIssues: PropTypes.func.isRequired,
  fetchIssues: PropTypes.func.isRequired,
  searchIssues: PropTypes.func.isRequired,
  setIssuesSearchValue: PropTypes.func.isRequired,
};

function mapStateToProps({ ui, issues }) {
  return {
    searchValue: issues.meta.searchValue,
    sidebarType: ui.sidebarType,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(issuesActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarFilter);
