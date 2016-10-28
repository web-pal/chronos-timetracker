import React, { PropTypes } from 'react';

const Img = ({ source }) =>
  <img role="presentation" src={source} />;

Img.propTypes = {
  source: PropTypes.string,
};

export default Img;
