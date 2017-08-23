import React from 'react';

import {
  issues,
  issuesBlue,
  recent,
  recentBlue,
  star,
  starBlue,
} from 'data/svg';
import Flex from '../../../components/Base/Flex/Flex';
import {
  Tab,
  TabIcon,
} from './styled';

export default () => (
  <Flex row spaceBetween style={{ minHeight: 52 }}>
    <Tab active>
      <TabIcon src={issuesBlue} alt="" />
      All
    </Tab>
    <Tab>
      <TabIcon src={recent} alt="" />
      Recent
    </Tab>
    <Tab>
      <TabIcon src={star} alt="" />
      Favorites
    </Tab>
  </Flex>
);
