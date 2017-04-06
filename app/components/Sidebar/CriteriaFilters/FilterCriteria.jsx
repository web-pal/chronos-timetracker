import React, { PropTypes } from 'react';

import Flex from '../../Base/Flex/Flex';
import FilterCriteriaOptions from './FilterCriteriaOptions';

class FilterCriteria extends React.Component {
  constructor(props) {
    super(props);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    if (!this.props.isOpen) {
      document.addEventListener('click', this.handleOutsideClick, false);
      this.props.handleClick(this.props.criteriaKey, true);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
      this.props.handleClick(this.props.criteriaKey, false);
    }
  }
  handleOutsideClick(e) {
    if (this.node.contains(e.target)) {
      return;
    }
    this.handleClick();
  }
  render() {
    const {
      name,
      isOpen,
      options,
      filterOfFilters,
      handleFilterOfFilters,
      handleCriteriaSet,
      criteriaKey,
      hideFilterOfFiltersField,
      isActive,
    } = this.props;
    return (<Flex
      column
      centered
      className="sidebar-filter-criterias__item"
    >
      <div ref={ (node) => { this.node = node; }}>
        <button
          type="button"
          onClick={this.handleClick}
          className={[
            'criteria-selector aui-button aui-button-subtle drop-arrow',
            `${isOpen ? 'active' : ''}`,
          ].join(' ')}
        >
          <div className="criteria-wrap">
            <span className="fieldLabel">{name}:</span>
            { isActive ? ' +' : ' All' }
          </div>
        </button>
        { isOpen &&
          <FilterCriteriaOptions
            handleFilterOfFilters={handleFilterOfFilters}
            filterOfFilters={filterOfFilters}
            hideFilterOfFiltersField={hideFilterOfFiltersField}
            options={options}
            handleCriteriaSet={(id, del) => handleCriteriaSet(id, criteriaKey, del)}
          />
        }
      </div>
    </Flex>);
  }
}


FilterCriteria.propTypes = {
  name: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  options: PropTypes.array,
  isOpen: PropTypes.bool,
  hideFilterOfFiltersField: PropTypes.bool,
  filterOfFilters: PropTypes.string.isRequired,
  handleFilterOfFilters: PropTypes.func.isRequired,
  handleCriteriaSet: PropTypes.func.isRequired,
  criteriaKey: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
};

FilterCriteria.defaultProps = {
  isOpen: false,
  hideFilterOfFiltersField: false,
  options: [{
    values: [],
  }],
};

export default FilterCriteria;
