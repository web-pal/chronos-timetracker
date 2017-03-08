import React, { PropTypes } from 'react';
import { Debounce } from 'react-throttle';

import Flex from '../../../Base/Flex/Flex';
import searchIcon from '../../../../assets/images/search@2x.png';
import refreshIcon from '../../../../assets/images/refresh@2x.png';

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
        <img src={searchIcon} width={18} height={18} />
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
      <img className="refreshIcon" src={refreshIcon} onClick={refreshIssues} width={20} height={19} />
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
