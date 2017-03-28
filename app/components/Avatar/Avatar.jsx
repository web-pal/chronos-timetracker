import React, { PropTypes } from 'react';

import Img from '../Base/Img/Img';

const Avatar = ({ avatarUrls }) =>
  <span className="avatar">
    <span className="avatar-inner">
      <Img
        src={
          avatarUrls.get('48x48') ||
          avatarUrls.get('32x32') ||
          avatarUrls.get('24x24') ||
          avatarUrls.get('16x16') ||
          ''
        }
      />
    </span>
  </span>;

Avatar.propTypes = {
  avatarUrls: PropTypes.object.isRequired,
};

export default Avatar;
