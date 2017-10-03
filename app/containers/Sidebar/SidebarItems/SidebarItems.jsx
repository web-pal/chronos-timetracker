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
// import SidebarAllItems from '../../components/Sidebar/SidebarAllItems/SidebarAllItems';
// import SidebarRecentItems from '../../components/Sidebar/SidebarRecentItems/SidebarRecentItems';
//
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
    <SidebarNoItems show={!fetching && totalCount === 0 && sidebarType === 'all'} />
    {sidebarType === 'all' && <SidebarAllItems />}
  </Flex>;

/*
 * <SidebarRecentItems
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
