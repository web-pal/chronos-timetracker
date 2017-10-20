// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';

import { Tab } from './styled';
import type { SetSidebarType } from '../../types';

type Props = {
  active: boolean,
  label: 'All' | 'Recent',
  onClick: SetSidebarType,
};

const SidebarHeaderTab: StatelessFunctionalComponent<Props> = ({
  active,
  label,
  onClick,
}: Props): Node =>
  <Tab
    active={active}
    onClick={() => onClick(label === 'All' ? 'all' : 'recent')}
  >
    {label}
  </Tab>;

export default SidebarHeaderTab;
