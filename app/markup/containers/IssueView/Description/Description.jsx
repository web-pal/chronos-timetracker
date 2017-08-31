import React from 'react';
import Flex from '../../../../components/Base/Flex/Flex';

import {
  Description,
} from './styled';

export default () => (
  <Description>
    <ul>
      <li style={{ marginBottom: 5 }}>
        {'add a channel to channels list called Homeaway API (with some API-ish logo beside homeaway log), and change the current homeaway channel to homeaway ical'}
      </li>
      <li style={{ marginBottom: 5 }}>
        {"I added status of homeaway api to /accounts/info... Remember, it's different fromr homeaway ical.."}
      </li>
      <li style={{ marginBottom: 5 }}>
        {"if it's false, we will show users how they can request to activate it, but if it's true, we will show users which listings are active in listingmap matrix and in a configure button. currently users can't change anything in configure button, they only can see which listings are active (using field homeawayApiActive of each listingMap)"}
      </li>
    </ul>
  </Description>
);
