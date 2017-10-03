import React, { PropTypes } from 'react';
import cn from 'classnames';

const Flex =
  ({
    children,
    row,
    column,
    wrap,
    centered,
    alignCenter,
    className,
    spaceBetween,
    spaceAround,
    onClick,
    style,
    id,
  }) =>
    <div
      className={cn(className, {
        'flex-row': row,
        'flex-column': column,
        'flex--center': centered,
        'flex--align-center': alignCenter,
        'flex--s-between': spaceBetween,
        'flex--s-around': spaceAround,
        wrap,
      })}
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
  alignCenter: PropTypes.bool,
  onClick: PropTypes.func,
};

Flex.defaultProps = {
  row: false,
  children: '',
  column: false,
  wrap: false,
  style: {},
  id: '',
  spaceBetween: false,
  spaceAround: false,
  className: '',
  centered: false,
  alignCenter: false,
  onClick: null,
};


export default Flex;
