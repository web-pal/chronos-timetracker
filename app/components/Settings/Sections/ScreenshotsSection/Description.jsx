import React, { PropTypes } from 'react';

import Flex from '../../../Base/Flex/Flex';

const Description = ({}) =>
  <Flex column className="Settings-section__description">
    <h2>
      Screenshot options
    </h2>
    <span>
      Configure whether to show screenshot popup or not,
      and the time untill it accepts automatically
    </span>
  </Flex>;

Description.propTypes = {

};

export default Description;
