import React, { PropTypes } from 'react';

/* eslint-disable no-nested-ternary */
const Flex =
  ({ children, row, column, wrap, centered, className, spaceBetween, spaceAround }) =>
    <div
      className={
        `flex-${row ? 'row' : column ? 'column' : ''} \
${wrap ? 'wrap' : ''} \
${centered ? 'flex--center' : ''} \
${spaceBetween ? 'flex--s-between' : ''} \
${spaceAround ? 'flex--s-around' : ''} \
${className || ''}`
      }
    >
      {children}
    </div>;

Flex.propTypes = {
  row: PropTypes.bool,
  column: PropTypes.bool,
  children: PropTypes.node,
  wrap: PropTypes.bool,
  spaceBetween: PropTypes.bool,
  spaceAround: PropTypes.bool,
  className: PropTypes.string,
  centered: PropTypes.bool,
};

export default Flex;
