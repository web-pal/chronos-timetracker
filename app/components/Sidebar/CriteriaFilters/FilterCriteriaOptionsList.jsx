import React, { PropTypes } from 'react';

const FilterCriteriaOptionsList = ({
  option,
}) =>
  <li className="check-list-item  imagebacked" role="option" >
    <label className={`item-label${(option.style && (` jira-issue-status-lozenge jira-issue-status-lozenge-${option.style.colorName}`))}`} title={option.name} data-descriptor-title={option.desctiption}>
      <input tabIndex="-1" value="" type="checkbox" />
      { (option.iconUrl && option.iconUrl[option.iconUrl.length - 1] !== '/') ? (<img alt="" src={option.iconUrl} align="absmiddle" width="16" height="16" />) : '' }
      {option.name}
    </label>
  </li>
;


FilterCriteriaOptionsList.propTypes = {
  option: PropTypes.object.isRequired,
};

export default FilterCriteriaOptionsList;
