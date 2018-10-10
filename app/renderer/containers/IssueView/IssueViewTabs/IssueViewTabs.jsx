// @flow
import React from 'react';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

import {
  Flex,
} from 'components';

import {
  TabItem,
} from './styled';


type Props = {
  tabs: Array<string>,
  currentTab: string,
  onTabClick: (tab: string) => void,
}

const IssueViewTabs: StatelessFunctionalComponent<Props> = ({
  tabs,
  currentTab,
  onTabClick,
}: Props): Node => (
  <Flex column style={{ minHeight: 32 }}>
    <Flex row spaceBetween style={{ minHeight: 32 }}>
      {tabs.map(
        tab =>
          <TabItem
            key={tab}
            active={tab === currentTab}
            onClick={() => {
              onTabClick(tab);
            }}
          >
            {tab}
          </TabItem>,
      )}
    </Flex>
  </Flex>
);

export default IssueViewTabs;
