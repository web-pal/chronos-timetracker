import React from 'react';

const Img = ({
  src,
  className,
}) =>
  <img alt="stringForLinter" role="presentation" src={src} className={`image ${className}`} />;

export default Img;
