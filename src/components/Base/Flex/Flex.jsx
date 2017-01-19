import React, { PropTypes } from 'react';

/* eslint-disable no-nested-ternary */
const Flex =
  ({
    children,
    row,
    column,
    wrap,
    centered,
    className,
    spaceBetween,
    spaceAround,
    onClick,
    style,
    id,
  }) =>
    <div
      className={
        `flex-${row ? 'row' : column ? 'column' : ''} \
${wrap ? 'wrap' : ''} \
${centered ? 'flex--center' : ''} \
${spaceBetween ? 'flex--s-between' : ''} \
${spaceAround ? 'flex--s-around' : ''} \
${className || ''}`
      }
      onClick={onClick}
      style={style}
      id={id}
    >
      {children}
    </div>;

Flex.propTypes = {
  row: PropTypes.bool,
  column: PropTypes.bool,
  children: PropTypes.node,
  wrap: PropTypes.bool,
  style: PropTypes.object,
  id: PropTypes.string,
  spaceBetween: PropTypes.bool,
  spaceAround: PropTypes.bool,
  className: PropTypes.string,
  centered: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Flex;
