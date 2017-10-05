// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import { Flex } from 'components';

import WorklogItem from './WorklogItem';

import {
  Button,
} from './styled';

const IssueWorklogs: StatelessFunctionalComponent<{}> = (): Node => (
  <Flex column>
    <Flex row alignCenter spaceBetween style={{ marginBottom: 25 }}>
      <Flex row style={{ paddingBottom: 5 }}>
        <span style={{ color: 'rgb(112,112,112)', marginRight: 5 }}>Logged today: </span>
        <span style={{ fontWeight: 500, color: '#0052cc' }}>2h 32min</span>
      </Flex>
      <Flex row>
        <Button>
          Calendar view
        </Button>
        <Button>
          Add manual time
        </Button>
      </Flex>
    </Flex>
    <Flex column style={{ overflowY: 'auto' }}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <WorklogItem key={i} />
      ))}
    </Flex>
  </Flex>
);

export default IssueWorklogs;
