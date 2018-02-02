// @flow
import React from 'react';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

import {
  Flex,
} from 'components';

import type {
  TabLabel,
} from '../../../types';

import {
  TabItem,
} from './styled';


type Props = {
  tabs: any,
  currentTab: TabLabel,
}

const IssueViewTabs: StatelessFunctionalComponent<Props> = ({
  tabs,
  currentTab,
  setUiState,
}: Props): Node => (
  <Flex column style={{ minHeight: 32 }}>
    <Flex row spaceBetween style={{ minHeight: 32 }}>
      {tabs.map(
        tab =>
          <TabItem
            key={tab}
            active={tab === currentTab}
            onClick={() => setUiState('issueViewTab', tab)}
          >
            {tab}
          </TabItem>,
      )}
    </Flex>
  </Flex>
);

export default IssueViewTabs;
