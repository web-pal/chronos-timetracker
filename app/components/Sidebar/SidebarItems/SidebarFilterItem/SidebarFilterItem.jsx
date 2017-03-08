import React, { PropTypes } from 'react';
import { Debounce } from 'react-throttle';

import Flex from '../../../Base/Flex/Flex';
import searchIcon from '../../../../assets/images/search.png';
import refreshIcon from '../../../../assets/images/refresh.png';

const SidebarFilterItem = ({
  onChange,
  value,
  onClear,
  refreshIssues,
  onResolveFilter,
  resolveFilter,
  hidden,
}) =>
  <Flex row className={`sidebar-filter-item ${hidden ? 'hidden' : ''}`}>
    <Flex column centered className="search-field">
      <Flex column centered>
        {value !== '' &&
          <span
            className="aui-icon aui-icon-small aui-iconfont-remove-label"
            onClick={() => {
              onChange('');
              document.getElementById('search').value = '';
            }}
          />
        }
        <img src={searchIcon} />
      </Flex>
      <Debounce time="300" handler="onChange">
        <input
          className="text"
          type="text"
          id="search"
          onChange={e => onChange(e.target.value)}
        />
      </Debounce>
    </Flex>
    <Flex column centered>
      <img src={refreshIcon} onClick={refreshIssues} />
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
