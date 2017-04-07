import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

const CriteriaFilterOption = ({
  option, handleCriteriaSet, showIcons,
}) =>
  <li className="check-list-item  imagebacked" role="option" >
    <label
      className={[
        'item-label',
        `${(option.get('style') && (` jira-issue-status-lozenge jira-issue-status-lozenge-${option.get('style').get('colorName')}`))}`,
      ]}
      title={option.get('name')}
      data-descriptor-title={option.get('desctiption')}
    >
      <input onChange={() => handleCriteriaSet(option.get('id'), option.get('checked'))} checked={option.get('checked')} type="checkbox" />
      { (showIcons
        && option.get('iconUrl')
        && option.get('iconUrl')[option.get('iconUrl').length - 1] !== '/'
        && <img alt="" src={option.get('iconUrl')} width="16" height="16" />) }
      {option.get('name')}
    </label>
  </li>;


CriteriaFilterOption.propTypes = {
  option: ImmutablePropTypes.map.isRequired,
  handleCriteriaSet: PropTypes.func.isRequired,
  showIcons: PropTypes.bool.isRequired,
};

export default CriteriaFilterOption;
