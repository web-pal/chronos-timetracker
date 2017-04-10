import React, { PropTypes } from 'react';

import FilterCriteriaOption from './FilterCriteriaOption.jsx';

const FilterCriteriaOptions = ({
  options,
  filterOfFilters,
  handleFilterOfFilters,
  handleCriteriaSet,
  hideFilterOfFiltersField,
  showIcons,
}) =>
  <div className={'sidebar-filter-criterias__options'}>
    <form action="#" className="searchfilter aui top-label aui-popup-content issuetype-criteria">
      <div className="form-body checkboxmultiselect-container">
        <div className="field-group aui-field-issuetype">
          <div className="check-list-select">
            { hideFilterOfFiltersField
                ? null
                : <div className="check-list-field-container">
                  <input
                    onChange={handleFilterOfFilters}
                    value={filterOfFilters}
                    placeholder="Find option"
                    className="aui-field check-list-field"
                  />
                  <span
                    className="icon-default aui-icon aui-icon-small aui-iconfont-search noloading"
                  />
                </div>
            }
            <div
              className="aui-list aui-list-scroll"
              role="listbox"
              style={{ display: 'block' }}
            >
              {
                options.map(list =>
                  <div key={list.key}>
                    <h5>{list.header}</h5>
                    <ul
                      id="standard-issue-types"
                      className="aui-list-section"
                      aria-label="Standard Issue Types"
                    >
                      {
                        list.values.map(option =>
                          <FilterCriteriaOption
                            key={option.get('name')}
                            showIcons={showIcons}
                            option={option}
                            handleCriteriaSet={handleCriteriaSet}
                          />,
                        )
                      }
                    </ul>
                  </div>,
                )
              }
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
;

FilterCriteriaOptions.propTypes = {
  options: PropTypes.array.isRequired,
  filterOfFilters: PropTypes.string,
  handleFilterOfFilters: PropTypes.func,
  handleCriteriaSet: PropTypes.func.isRequired,
  hideFilterOfFiltersField: PropTypes.bool.isRequired,
  showIcons: PropTypes.bool.isRequired,
};

FilterCriteriaOptions.defaultProps = {
  filterOfFilters: null,
  handleFilterOfFilters: null,
};

export default FilterCriteriaOptions;
