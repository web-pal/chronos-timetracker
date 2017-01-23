import React, { PropTypes } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

const Dropdown = (props) => {
  const { name, options, value, onChange, fetching } = props;
  return (
    <Select
      name={name}
      options={options}
      value={value}
      onChange={option => onChange(option.value)}
      isLoading={fetching}
    />
  );
};

Dropdown.propTypes = {
  name: PropTypes.string,
  options: PropTypes.array,
  value: PropTypes.object,
  fetching: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Dropdown;
