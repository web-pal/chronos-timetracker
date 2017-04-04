import React, { PropTypes } from 'react';

import Flex from '../../Base/Flex/Flex';
import FilterCriteriaOptions from './FilterCriteriaOptions';


const FilterCriteria = ({
  name, isOpen, handleClick, options, filterOfFilters, handleFilterOfFilters,
}) =>
  <Flex column centered data-id="issuetype" className={'sidebar-filter-criterias__item'}>
    <button type="button" data-id="issuetype" className={`criteria-selector aui-button aui-button-subtle drop-arrow ${isOpen ? 'active' : ''}`} onClick={() => handleClick(isOpen ? '' : name)}>
      <div className="criteria-wrap">
        <span className="fieldLabel">{name}:</span> All
      </div>
    </button>
    <a href="" className="remove-filter hidden" title="delete" tabIndex="-1">
      <span className="aui-icon aui-icon-small aui-iconfont-remove" />
    </a>
    { isOpen
      ? <FilterCriteriaOptions
        handleFilterOfFilters={handleFilterOfFilters}
        filterOfFilters={filterOfFilters}
        options={options}
      />
     : null }
  </Flex>
;

FilterCriteria.propTypes = {
  name: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  options: PropTypes.object,
  isOpen: PropTypes.bool,
  filterOfFilters: PropTypes.string.isRequired,
  handleFilterOfFilters: PropTypes.func.isRequired,
};

FilterCriteria.defaultProps = {
  isOpen: false,
  options: [{ header: 'Standard Issue Types1', values: ['bug', 'epic', 'another', 'epic', 'another'] }, { header: 'Standard Issue Types2', values: ['bug', 'epic', 'another'] }],
};

export default FilterCriteria;
