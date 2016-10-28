import React, { PropTypes } from 'react';

const A = props =>
  <a {...props}>
    {props.label || ''}
    {props.children}
  </a>;

A.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node,
};

export default A;
