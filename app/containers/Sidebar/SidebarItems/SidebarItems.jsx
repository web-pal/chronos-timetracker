// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { issuesActions } from 'actions';
import { Flex } from 'components';
import { getIssuesFetching, getIssuesTotalCount, getSidebarType } from 'selectors';

import SidebarNoItems from './SidebarNoItems';
import SidebarAllItems from './SidebarAllItems';
import SidebarRecentItems from './SidebarRecentItems';

import type { SidebarType } from '../../../types';

type Props = {
  fetching: boolean,
  totalCount: number,
  sidebarType: SidebarType,
}

const SidebarItems: StatelessFunctionalComponent<Props> = ({
  fetching,
  totalCount,
  sidebarType,
}: Props): Node =>
  <Flex column style={{ height: '100%' }}>
    {!fetching && totalCount === 0 && sidebarType === 'all' &&
      <SidebarNoItems />
    }
    {sidebarType === 'all' && <SidebarAllItems />}
    {sidebarType === 'recent' && <SidebarRecentItems />}
  </Flex>;

/*
 * <sidebarrecentitems
 *   style={{ display: `${sidebarType === 'all' ? 'none' : 'block'}` }}
 * />
 */

function mapStateToProps(state) {
  return {
    fetching: getIssuesFetching(state),
    totalCount: getIssuesTotalCount(state),
    sidebarType: getSidebarType(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(issuesActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarItems);
