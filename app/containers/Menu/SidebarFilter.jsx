import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as issuesActions from '../../actions/issues';

import Flex from '../../components/Base/Flex/Flex';

import searchIcon from '../../assets/images/search@2x.png';
import refreshIcon from '../../assets/images/refresh@2x.png';

const FilterCriteriaOptionsList = ({
  name, image,
}) =>
  <li className="check-list-item  imagebacked" role="option" >
    <label className="item-label" title="Epic" data-descriptor-title="Epic">
      <input tabIndex="-1" value="" type="checkbox" />
      {name}
      { image ? (<img alt="" src={image} align="absmiddle" width="16" height="16" />) : '' }
    </label>
  </li>
;


FilterCriteriaOptionsList.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string,
};

FilterCriteriaOptionsList.defaultProps = {
  image: '',
};


const FilterCriteriaOptions = () =>
  <div className={'sidebar-filter-criterias__options'}>
    <form id="issue-filter" action="#" className="searchfilter aui top-label aui-popup-content issuetype-criteria">
      <div className="form-body checkboxmultiselect-container">
        <div className="field-group aui-field-issuetype">
          <div className="check-list-select" id="searcher-type-multi-select" data-query="">
            <div className="check-list-field-container">
              <input autoComplete="off" role="combobox" aria-autocomplete="list" aria-haspopup="true" aria-expanded="true" placeholder="Find Statuses..." className="aui-field check-list-field" id="searcher-status-input" aria-controls="searcher-status-suggestions" aria-activedescendant="10101-9" />
              <span className="icon-default aui-icon aui-icon-small aui-iconfont-search noloading" />
            </div>
            <div className="aui-list" id="searcher-type-suggestions" tabIndex="-1" role="listbox" style={{ display: 'block' }} >
              <h5>Standard Issue Types</h5>
              <ul id="standard-issue-types" className="aui-list-section" aria-label="Standard Issue Types">
                <FilterCriteriaOptionsList name={'bug'} />
                <FilterCriteriaOptionsList name={'epic'} />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
;


const FilterCriteria = ({
  name, isOpen = false, handleClick,
}) =>
  <Flex column centered data-id="issuetype" className={'sidebar-filter-criterias__item'}>
    <button type="button" data-id="issuetype" className={`criteria-selector aui-button aui-button-subtle drop-arrow ${isOpen ? 'active' : ''}`} onClick={() => handleClick(isOpen ? '' : name)}>
      <div className="criteria-wrap">
        <span className="fieldLabel">{name}:</span> All
      </div>
    </button>
    <a href="" className="remove-filter hidden" title="Удалить ограничение" tabIndex="-1">
      <span className="aui-icon aui-icon-small aui-iconfont-remove" />
    </a>
    { isOpen ? <FilterCriteriaOptions /> : null }
  </Flex>
;

FilterCriteria.propTypes = {
  name: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
};


const SidebarFilter = ({
  searchValue, sidebarType, searchIssues,
  clearIssues, fetchIssues, fetchRecentIssues, setIssuesSearchValue,
  showingFilterCriteriaBlock, setShowingFilterCriteriaBlock,
}) =>
  <Flex column centered >
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
            fetchRecentIssues();
            fetchIssues();
          }}
          width={20}
          height={19}
        />
      </Flex>
    </Flex>
    <Flex row className={`sidebar-filter-item sidebar-filter-item--criterias ${sidebarType === 'Recent' ? 'hidden' : ''}`}>
      <Flex column centered className={'sidebar-filter-criterias'} >
        <Flex row centered>
          <FilterCriteria name={'Type'} handleClick={setShowingFilterCriteriaBlock} isOpen={showingFilterCriteriaBlock === 'Type'} />
          <FilterCriteria name={'Status'} handleClick={setShowingFilterCriteriaBlock} isOpen={showingFilterCriteriaBlock === 'Status'} />
          <FilterCriteria name={'Assignee'} handleClick={setShowingFilterCriteriaBlock} isOpen={showingFilterCriteriaBlock === 'Assignee'} />
        </Flex>
      </Flex>
    </Flex>
  </Flex>;

SidebarFilter.propTypes = {
  searchValue: PropTypes.string.isRequired,
  sidebarType: PropTypes.string.isRequired,
  clearIssues: PropTypes.func.isRequired,
  fetchIssues: PropTypes.func.isRequired,
  fetchRecentIssues: PropTypes.func.isRequired,
  searchIssues: PropTypes.func.isRequired,
  setIssuesSearchValue: PropTypes.func.isRequired,
  showingFilterCriteriaBlock: PropTypes.string.isRequired,
  setShowingFilterCriteriaBlock: PropTypes.func.isRequired,
};

function mapStateToProps({ ui, issues }) {
  return {
    searchValue: issues.meta.searchValue,
    showingFilterCriteriaBlock: issues.meta.showingFilterCriteriaBlock,
    sidebarType: ui.sidebarType,
  };
}

console.log('issuesActions', issuesActions);


function mapDispatchToProps(dispatch) {
  return bindActionCreators(issuesActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarFilter);
