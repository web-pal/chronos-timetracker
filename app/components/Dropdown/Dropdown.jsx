import React, { PropTypes } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

const Dropdown = (props) => {
  const { name, options, value, onChange, fetching, placeholder, className } = props;
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
  options: PropTypes.array,
  value: PropTypes.object,
  fetching: PropTypes.bool,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default Dropdown;
