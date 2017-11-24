// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import { noIssuesImage } from 'data/assets';
import { Flex } from 'components';
import { NoIssuesImage, Title, Subtitle } from './styled';

type Props = {
  recent: boolean
};

const SidebarNoItems: StatelessFunctionalComponent<Props> = ({ recent }: Props): Node =>
  <Flex
    column
    centered
    alignCenter
    style={{ width: '100%', height: '100%', flex: '1 0 100%' }}
  >
    <NoIssuesImage src={noIssuesImage} alt="Not found" />
    {recent
      ? <Title> Nothing tracked recently </Title>
      : <Title>No issues found</Title>
    }
    {recent
      ? <Subtitle>Track any issue to see it in {'"Recent"'} tab</Subtitle>
      : <Subtitle>Try to change filters and try again</Subtitle>
    }
  </Flex>;

export default SidebarNoItems;
