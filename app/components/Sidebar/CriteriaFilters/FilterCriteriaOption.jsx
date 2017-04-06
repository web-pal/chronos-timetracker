import React, { PropTypes } from 'react';

const CriteriaFilterOption = ({
  option, handleCriteriaSet,
}) =>
  <li className="check-list-item  imagebacked" role="option" >
    <label
      className={[
        'item-label',
        `${(option.style && (` jira-issue-status-lozenge jira-issue-status-lozenge-${option.style.colorName}`))}`,
      ]}
      title={option.name}
      data-descriptor-title={option.desctiption}
    >
      <input onChange={() => handleCriteriaSet(option.id, option.checked)} checked={option.checked} type="checkbox" />
      { (option.iconUrl && option.iconUrl[option.iconUrl.length - 1] !== '/')
        ? (<img alt="" src={option.iconUrl} width="16" height="16" />)
        : '' }
      {option.name} {option.id}
    </label>
  </li>;


CriteriaFilterOption.propTypes = {
  option: PropTypes.object.isRequired,
  handleCriteriaSet: PropTypes.func.isRequired,
};

export default CriteriaFilterOption;
