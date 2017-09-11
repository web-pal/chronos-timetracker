import React from 'react';

import Flex from '../../../components/Base/Flex/Flex';
import { Tab } from './styled';

// eslint-disable-next-line
export default ({ tabs, activeTab, onChangeTab }) => (
  <Flex column style={{ minHeight: 32 }}>
    <Flex row spaceBetween style={{ minHeight: 32 }}>
      {tabs.map((tab) => (
        <Tab
          active={tab.label === activeTab}
          onClick={() => onChangeTab(tab.label)}
        >
          {tab.label}
        </Tab>
      ))}
    </Flex>
  </Flex>
);
