import React, { PropTypes } from 'react';

import Flex from '../../../Base/Flex/Flex';

const SidebarFilterItem = ({ onChange, value, onClear, onResolveFilter, resolveFilter }) =>
  <Flex row centered className="sidebar-filter-item">
    <input className="text" type="text" value={value} onChange={e => onChange(e.target.value)} />
    <span className="aui-icon aui-icon-small aui-iconfont-search" />
    {value !== '' &&
      <span
        className="aui-icon aui-icon-small aui-iconfont-remove-label"
        onClick={onClear}
      />
    }
    <a title={`${resolveFilter ? 'Show' : 'Hide'} resolved issues`}>
      <span
        className={`fa ${resolveFilter ? 'fa-eye-slash' : 'fa-eye'}`}
        onClick={onResolveFilter}
      />
    </a>
  </Flex>;

SidebarFilterItem.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onResolveFilter: PropTypes.func.isRequired,
  resolveFilter: PropTypes.bool.isRequired,
};

export default SidebarFilterItem;
