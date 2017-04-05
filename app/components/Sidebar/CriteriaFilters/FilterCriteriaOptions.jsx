import React, { PropTypes } from 'react';

import FilterCriteriaOption from './FilterCriteriaOption.jsx';

const FilterCriteriaOptions = ({
  options, filterOfFilters, handleFilterOfFilters, handleCriteriaSet, hideFilterOfFiltersField,
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
                    autoComplete="off"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-haspopup="true"
                    aria-expanded="true"
                    placeholder="Find Statuses..."
                    className="aui-field check-list-field"
                    id="searcher-status-input"
                    aria-controls="searcher-status-suggestions"
                    aria-activedescendant="10101-9"
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
                            key={option.name}
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
  filterOfFilters: PropTypes.string.isRequired,
  handleFilterOfFilters: PropTypes.func.isRequired,
  handleCriteriaSet: PropTypes.func.isRequired,
  hideFilterOfFiltersField: PropTypes.bool.isRequired,
};

export default FilterCriteriaOptions;
