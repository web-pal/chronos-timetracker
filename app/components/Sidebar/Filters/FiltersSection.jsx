import React, { PropTypes } from 'react';

import FilterOption from './FilterOption';

import { FilterItem, FilterOptions } from './styled';
import { H200 } from '../../../styles/typography';

const FiltersSection = ({ title, options, handleCriteriaSet, criteriaKey, showIcons }) => (
  <FilterItem>
    <H200 style={{ padding: '10px 0 4px 10px', display: 'block' }}>
      {title}
    </H200>
    <FilterOptions>
      {options[0].values.map(option => (
        <FilterOption
          option={option}
          handleCriteriaSet={(value, del) => handleCriteriaSet(value, criteriaKey, del)}
          showIcons={showIcons}
        />
      ))}
    </FilterOptions>
  </FilterItem>
);

FiltersSection.propTypes = {
  criteriaKey: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  handleCriteriaSet: PropTypes.func.isRequired,
  showIcons: PropTypes.bool.isRequired,
};

export default FiltersSection;
