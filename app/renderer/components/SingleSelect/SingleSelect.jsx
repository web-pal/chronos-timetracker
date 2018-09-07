/* eslint-disable */
/*
 * THIS COMPONENT IS TEMPORARY FORKED FROM
 * https://bitbucket.org/atlassian/atlaskit/src/4e15b22cd39d/packages/single-select/?at=master
 * BECAUSE IT'S BROKEN
 */
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { StatelessSelect } from '@atlaskit/single-select';

// =============================================================
// NOTE: Duplicated in ./internal/appearances until docgen can follow imports.
// -------------------------------------------------------------
// DO NOT update values here without updating the other.
// =============================================================

const appearances = {
  values: [
    'default',
    'subtle',
  ],
  default: 'default',
};

export default class AkSingleSelect extends PureComponent {
  static propTypes = {
    /** Subtle items do not have a background color. */
    appearance: PropTypes.oneOf(appearances.values),
    /** Item to be selected on component mount. */
    /** Sets whether the dropdown should be constrained to the width of its trigger */
    droplistShouldFitContainer: PropTypes.bool,
    /** Sets whether the field should be selectable. If it is, the field will be
    a text box, which will filter the items. */
    isLoading: PropTypes.bool,
    loadingMessage: PropTypes.string,
    hasAutocomplete: PropTypes.bool,
    /** id property to be passed down to the html select component. */
    id: PropTypes.string,
    /** message to show on the dialog when isInvalid is true */
    invalidMessage: PropTypes.node,
    /** controls the top margin of the label component rendered. */
    isFirstChild: PropTypes.bool,
    /** Sets whether the select is selectable. Changes hover state. */
    isDisabled: PropTypes.bool,
    /** Sets whether the component should be open on mount. */
    isDefaultOpen: PropTypes.bool,
    /** Sets whether form including select can be submitted without an option
    being made. */
    isRequired: PropTypes.bool,
    /** Set whether there is an error with the selection. Sets an orange border
    and shows the warning icon. */
    isInvalid: PropTypes.bool,
    /** An array of objects, each one of which must have an array of items, and
    may have a heading. All items should have content and value properties, with
    content being the displayed text. */
    /** Label to be displayed above select. */
    label: PropTypes.string,
    /** name property to be passed to the html select element. */
    name: PropTypes.string,
    /** Message to display in any group in items if there are no items in it,
    including if there is one item that has been selected. */
    noMatchesFound: PropTypes.string,
    /** Handler to be called when the filtered items changes. */
    onFilterChange: PropTypes.func,
    /** Handler to be called when an item is selected. Called with an object that
    has the item selected as a property on the object. */
    onSelected: PropTypes.func,
    /** Handler called when the select is opened or closed. Called with an object
    that has both the event, and the new isOpen state. */
    onOpenChange: PropTypes.func,
    /** Text to be shown within the select when no item is selected. */
    placeholder: PropTypes.string,
    /** Where the select dropdown should be displayed relative to the field position. */
    position: PropTypes.string,
    /** Sets whether the field should be constrained to the width of its trigger */
    shouldFitContainer: PropTypes.bool,
    /** Sets whether the field will become focused. */
    shouldFocus: PropTypes.bool,
    /** Sets whether the droplist should flip its position when there is not enough space. */
    shouldFlip: PropTypes.bool,
    /** Set the max height of the dropdown list in pixels. */
    maxHeight: PropTypes.number,
  }

  static defaultProps = {
    appearance: appearances.default,
    droplistShouldFitContainer: true,
    isRequired: false,
    items: [],
    label: '',
    onFilterChange: () => {},
    onOpenChange: () => {},
    onSelected: () => {},
    placeholder: '',
    position: 'bottom left',
    shouldFocus: false,
    shouldFlip: true,
  }

  state = {
    isOpen: this.props.isDefaultOpen,
    selectedItem: this.props.defaultSelected,
    filterValue: this.props.defaultSelected ? this.props.defaultSelected.content : '',
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedItem) {
      this.setState({
        selectedItem: nextProps.selectedItem,
        filterValue: nextProps.selectedItem.content,
      });
    }
  }

  selectItem = (item) => {
    this.setState({ isOpen: false, selectedItem: item });
    this.props.onSelected({ item });
  }

  handleOpenChange = (attrs) => {
    this.setState({ isOpen: attrs.isOpen });
    this.props.onOpenChange(attrs);
  }

  handleFilterChange = (value) => {
    this.props.onFilterChange(value);
    this.setState({ filterValue: value });
  }

  render() {
    return (
      <StatelessSelect
        appearance={this.props.appearance}
        droplistShouldFitContainer={this.props.droplistShouldFitContainer}
        filterValue={this.state.filterValue}
        hasAutocomplete={this.props.hasAutocomplete}
        isLoading={this.props.isLoading}
        loadingMessage={this.props.loadingMessage}
        id={this.props.id}
        isDisabled={this.props.isDisabled}
        isFirstChild={this.props.isFirstChild}
        isInvalid={this.props.isInvalid}
        invalidMessage={this.props.invalidMessage}
        isOpen={this.state.isOpen}
        isRequired={this.props.isRequired}
        items={this.props.items}
        label={this.props.label}
        name={this.props.name}
        noMatchesFound={this.props.noMatchesFound}
        onFilterChange={this.handleFilterChange}
        onOpenChange={this.handleOpenChange}
        onSelected={this.selectItem}
        placeholder={this.props.placeholder}
        position={this.props.position}
        selectedItem={this.state.selectedItem}
        shouldFitContainer={this.props.shouldFitContainer}
        shouldFocus={this.props.shouldFocus}
        shouldFlip={this.props.shouldFlip}
        maxHeight={this.props.maxHeight}
      />
    );
  }
}
