// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import { getSidebarType } from 'selectors';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { uiActions } from 'actions';

import { TabContainer } from './styled';
import SidebarHeaderTab from './SidebarHeaderTab';

import type { SetSidebarType, SidebarType } from '../../types';

type Props = {
  sidebarType: SidebarType,
  setSidebarType: SetSidebarType,
};

const SidebarHeader: StatelessFunctionalComponent<Props> = ({
  sidebarType,
  setSidebarType,
}: Props): Node =>
  <TabContainer>
    <SidebarHeaderTab
      active={sidebarType === 'recent'}
      label="Recent"
      onClick={setSidebarType}
    />
    <SidebarHeaderTab
      active={sidebarType === 'all'}
      label="All"
      onClick={setSidebarType}
    />
  </TabContainer>;

// <TabIcon src={issuesBlue} alt="" />
// <TabIcon src={recent} alt="" />
// <TabIcon src={star} alt="" />
//
function mapStateToProps(state) {
  return {
    sidebarType: getSidebarType(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(uiActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarHeader);
