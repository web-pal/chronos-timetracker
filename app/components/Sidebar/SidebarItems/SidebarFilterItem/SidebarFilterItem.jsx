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
  hidden,
}) =>
  <Flex row centered className={`sidebar-filter-item ${hidden ? 'hidden' : ''}`}>
    <Flex column centered>
      <span className="aui-icon aui-icon-small aui-iconfont-search flex-item--start" />
    </Flex>
    <Flex column centered className="search-field">
      <Debounce time="300" handler="onChange">
        <input
          className="text"
          type="text"
          id="search"
          onChange={e => onChange(e.target.value)}
        />
      </Debounce>
      {value !== '' &&
        <span
          className="aui-icon aui-icon-small aui-iconfont-remove-label"
          onClick={() => {
            onChange('');
            document.getElementById('search').value = '';
          }}
        />
      }
    </Flex>
    <Flex column centered>
      <span className="fa fa-refresh" onClick={refreshIssues} />
    </Flex>
  </Flex>;

SidebarFilterItem.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onResolveFilter: PropTypes.func.isRequired,
  resolveFilter: PropTypes.bool.isRequired,
  hidden: PropTypes.bool.isRequired,
};

export default SidebarFilterItem;
