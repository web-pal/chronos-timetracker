// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import { noIssuesImage } from 'data/assets';
import { Flex } from 'components';
import { NoIssuesImage, Title, Subtitle } from './styled';

type Props = {};

const NoItems: StatelessFunctionalComponent<Props> = (): Node =>
  <Flex
    column
    centered
    alignCenter
    style={{ width: '100%', height: '100%' }}
  >
    <NoIssuesImage src={noIssuesImage} alt="Not found" />
    <Title>No issues found</Title>
    <Subtitle>Try to change filters and try again</Subtitle>
  </Flex>;

export default NoItems;
