import React, { PropTypes } from 'react';

const Checkbox = ({ input, label, type, disabled }) => (
  <div className="flex-row">
    <label className="checkbox-label">
      {label}
    </label>
    <label className="switch">
      <input
        {...input}
        type={type}
        disabled={disabled}
      />
      <div className="slider round" />
    </label>
  </div>
);

Checkbox.propTypes = {
  input: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
};

Checkbox.defaultProps = {
  label: '',
  disabled: false,
};

export default Checkbox;

