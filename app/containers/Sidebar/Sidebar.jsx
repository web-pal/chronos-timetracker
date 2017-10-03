// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Flex } from 'components';
import { uiActions } from 'actions';
import { getSidebarType, getSelectedProjectId } from 'selectors';

import SidebarItems from './SidebarItems/SidebarItems';
// import Filters from './Filters';
import ProjectPicker from './ProjectPicker';
import SidebarHeader from './SidebarHeader';
// import SidebarFilter from './SidebarFilter';

import type { SetSidebarType, SidebarType, Id } from '../../types';

type Props = {
  sidebarType: SidebarType,
  setSidebarType: SetSidebarType,
  selectedProjectId: Id | null,
  // showSidebarFilters: boolean,
};

const Sidebar: StatelessFunctionalComponent<Props> = ({
  sidebarType,
  setSidebarType,
  selectedProjectId,
  // showSidebarFilters,
}: Props): Node => (
  <Flex column className="SidebarWrapper">
    <ProjectPicker />
    <SidebarHeader
      sidebarType={sidebarType}
      setSidebarType={setSidebarType}
    />
    <Flex column className="sidebar">
      {selectedProjectId ?
        <SidebarItems /> :
        <span className="sidebar-nothing-selected">
          <span>Select project from dropdown above</span>
        </span>
      }
    </Flex>
  </Flex>
);

/*
 *   {sidebarType === 'All' &&
 *     <SidebarFilter />
 *   }
 *   {showSidebarFilters &&
 *     <Filters />
 *   }
 *   {selectedProjectId ?
 *     <SidebarItems /> :
 *     <span className="sidebar-nothing-selected">
 *       <span>Select project from dropdown above</span>
 *     </span>
 *   }
 */

function mapStateToProps(state) {
  return {
    sidebarType: getSidebarType(state),
    selectedProjectId: getSelectedProjectId(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(uiActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
