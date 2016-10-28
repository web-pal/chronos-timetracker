import React, { PropTypes } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

const Dropdown = (props) => {
  const { name, options, value, onChange } = props;
  return (
    <Select
      name={name}
      options={options}
      value={value}
      onChange={onChange}
    />
  );
};

Dropdown.propTypes = {
  name: PropTypes.string,
  options: PropTypes.array,
  value: PropTypes.object,
  onChange: PropTypes.func,
};

export default Dropdown;
