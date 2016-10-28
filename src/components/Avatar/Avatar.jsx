import React, { PropTypes } from 'react';

import Img from '../Base/Img/Img';

const Avatar = ({ avatarUrl }) =>
  <span className="avatar">
    <span className="avatar-inner">
      <Img source={avatarUrl || ''} />
    </span>
  </span>;

Avatar.propTypes = {
  avatarUrl: PropTypes.string,
};

export default Avatar;
