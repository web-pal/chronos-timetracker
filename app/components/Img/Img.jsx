import React, { PropTypes } from 'react';

const Img = ({ src, className }) =>
  <img alt="stringForLinter" role="presentation" src={src} className={`image ${className}`} />;

Img.propTypes = {
  src: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
};

export default Img;
