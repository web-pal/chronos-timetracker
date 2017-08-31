import React from 'react';
import Flex from '../../../../components/Base/Flex/Flex';

import {
  Bar,
  BarLabel,
  BarValue,
  ProgressBar,
} from './styled';

export default () => (
  <Flex column>
    <Flex row spaceBetween>
      <Flex column style={{ width: '40%' }}>
        <Flex row spaceBetween style={{ marginBottom: 2 }}>
          <BarLabel>
            Logged today:
          </BarLabel>
          <BarValue>
            2h
          </BarValue>
        </Flex>
        <Flex row spaceBetween style={{ marginBottom: 2 }}>
          <BarLabel>
            Logged today:
          </BarLabel>
          <BarValue>
            2h
          </BarValue>
        </Flex>
        <Flex row spaceBetween style={{ marginBottom: 2 }}>
          <BarLabel>
            Logged today:
          </BarLabel>
          <BarValue>
            2h
          </BarValue>
        </Flex>
        <Flex row spaceBetween style={{ marginBottom: 2 }}>
          <BarLabel>
            Logged today:
          </BarLabel>
          <BarValue>
            2h
          </BarValue>
        </Flex>
        <Flex row spaceBetween style={{ marginBottom: 2 }}>
          <BarLabel>
            Logged today:
          </BarLabel>
          <BarValue>
            2h
          </BarValue>
        </Flex>
      </Flex>
      <div style={{ width: 2, backgroundColor: 'rgba(0, 0, 0, 0.08)' }} />
      <Flex column style={{ width: '40%' }}>
        <Bar>
          <Flex row spaceBetween style={{ padding: '0px 3px 0px 1px' }}>
            <BarLabel>
              Estimated
            </BarLabel>
            <BarValue>
              2d
            </BarValue>
          </Flex>
          <ProgressBar color="#2b69c5" />
        </Bar>
        <Bar>
          <Flex row spaceBetween style={{ padding: '0px 3px 0px 1px' }}>
            <BarLabel>
              Logged
            </BarLabel>
            <BarValue>
              13h
            </BarValue>
          </Flex>
          <ProgressBar color="#51a825" />
        </Bar>
        <Bar>
          <Flex row spaceBetween style={{ padding: '0px 3px 0px 1px' }}>
            <BarLabel>
              Remaining
            </BarLabel>
            <BarValue>
              35h
            </BarValue>
          </Flex>
          <ProgressBar color="#ec8e00" />
        </Bar>
      </Flex>
    </Flex>
    <h2
      style={{
        marginTop: 150,
        fontWeight: 600,
        fontSize: 32,
        color: 'rgba(0, 0, 0, .62)',
      }}
    >SOME FANCY GRAPHS HERE</h2>
  </Flex>
);
