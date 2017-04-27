import React, { PropTypes } from 'react';

import Flex from '../../../Base/Flex/Flex';

const Description = ({}) =>
  <Flex column className="Settings-section__description">
    <h2>
      Notification Options
    </h2>
    <span>
      Configure whether to show native OSX notification<br/>
      or custom popup. Native popups are visible in fullscreen apps.
    </span>
  </Flex>

Description.propTypes = {

};

export default Description;
