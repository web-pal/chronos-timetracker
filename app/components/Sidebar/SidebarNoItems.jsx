import React, { PropTypes } from 'react';

import Flex from '../Base/Flex/Flex';

const NoItems = ({ show }) => show &&
  <Flex column centered className="RecentEmptyItem">
    Nothing found
  </Flex>;

NoItems.propTypes = {
  show: PropTypes.bool,
};

export default NoItems;
