import React, { PropTypes } from 'react';

import Flex from '../../Base/Flex/Flex';
import FilterCriteriaOptions from './FilterCriteriaOptions';


const FilterCriteria = ({
  name,
  isOpen,
  handleClick,
  options,
  filterOfFilters,
  handleFilterOfFilters,
  handleCriteriaSet,
  criteriaKey,
  hideFilterOfFiltersField,
}) =>
  <Flex column centered className="sidebar-filter-criterias__item">
    <button
      type="button"
      onClick={() => handleClick(isOpen ? 'none' : name)}
      className={[
        'criteria-selector aui-button aui-button-subtle drop-arrow',
        `${isOpen ? 'active' : ''}`,
      ].join(' ')}
    >
      <div className="criteria-wrap">
        <span className="fieldLabel">{name}:</span> All
      </div>
    </button>
    { isOpen &&
      <FilterCriteriaOptions
        handleFilterOfFilters={handleFilterOfFilters}
        filterOfFilters={filterOfFilters}
        hideFilterOfFiltersField={hideFilterOfFiltersField}
        options={options}
        handleCriteriaSet={(id, del) => handleCriteriaSet(id, criteriaKey, del)}
      />
    }
  </Flex>
;

FilterCriteria.propTypes = {
  name: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  options: PropTypes.array,
  isOpen: PropTypes.bool,
  hideFilterOfFiltersField: PropTypes.bool,
  filterOfFilters: PropTypes.string.isRequired,
  handleFilterOfFilters: PropTypes.func.isRequired,
  handleCriteriaSet: PropTypes.func.isRequired,
  criteriaKey: PropTypes.string.isRequired,
};

FilterCriteria.defaultProps = {
  isOpen: false,
  hideFilterOfFiltersField: false,
  options: [{
    header: 'Standard Issue Types1',
    values: ['bug', 'epic', 'another', 'epic', 'another'],
  },
  {
    header: 'Standard Issue Types2',
    values: ['bug', 'epic', 'another'],
  }],
};

export default FilterCriteria;
