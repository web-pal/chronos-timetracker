import React, { PropTypes } from 'react';
import Select from 'react-select';

const Dropdown = (props) => {
  const {
    name,
    options,
    value,
    onChange,
    fetching,
    placeholder,
    className,
  } = props;
  return (
    <Select
      name={name}
      options={options}
      value={value}
      placeholder={placeholder}
      onChange={option => onChange(option.value)}
      isLoading={fetching}
      clearable={false}
      className={className}
    />
  );
};

Dropdown.propTypes = {
  name: PropTypes.string,
  options: PropTypes.array.isRequired,
  value: PropTypes.object.isRequired,
  fetching: PropTypes.bool,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

Dropdown.defaultProps = {
  name: '',
  fetching: false,
  onChange: null,
  placeholder: '',
  className: '',
};

export default Dropdown;
