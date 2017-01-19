import React, { PropTypes } from 'react';
import { Debounce } from 'react-throttle';

import Flex from '../../../Base/Flex/Flex';

const SidebarFilterItem = ({
  onChange,
  value,
  onClear,
  refreshIssues,
  onResolveFilter,
  resolveFilter,
}) =>
  <Flex row spaceBetween className="sidebar-filter-item">
    <Flex column centered>
      <span className="aui-icon aui-icon-small aui-iconfont-search flex-item--start" />
    </Flex>
    <div className="search-field">
      <Debounce time="1000" handler="onChange">
        <input
          className="text"
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </Debounce>
      {value !== '' &&
        <span
          className="aui-icon aui-icon-small aui-iconfont-remove-label"
          onClick={onClear}
        />
      }
    </div>
    <a className="flex-item--end" title={`${resolveFilter ? 'Show' : 'Hide'} resolved issues`}>
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
  refreshIssues: PropTypes.func.isRequired,
  onResolveFilter: PropTypes.func.isRequired,
  resolveFilter: PropTypes.bool.isRequired,
};

export default SidebarFilterItem;
