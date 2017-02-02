import React, { PropTypes } from 'react';

const Img = ({ src, className }) =>
  <img role="presentation" src={src} className={`image ${className}`} />;

Img.propTypes = {
  src: PropTypes.string,
  className: PropTypes.string,
};

export default Img;
