import React, { PropTypes } from 'react';

const FilterCriteriaOptionsList = ({
  name, image,
}) =>
  <li className="check-list-item  imagebacked" role="option" >
    <label className="item-label" title={name} data-descriptor-title={name}>
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

export default FilterCriteriaOptionsList;
