// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Flex } from 'components';
import { uiActions } from 'actions';
import { getSidebarType, getSelectedProjectId, getSidebarFiltersOpen } from 'selectors';

import ProjectPicker from './ProjectPicker';
import SidebarHeader from './SidebarHeader';
import SidebarSearch from './SidebarSearch';
import SidebarFilters from './SidebarFilters/SidebarFilters';
import SidebarItems from './SidebarItems/SidebarItems';

import { SidebarNothingSelected, SidebarWrapper, SidebarContainer } from './styled';

import type { SetSidebarType, SidebarType, Id } from '../../types';

type Props = {
  sidebarType: SidebarType,
  setSidebarType: SetSidebarType,
  selectedProjectId: Id | null,
  sidebarFiltersOpen: boolean,
};

const Sidebar: StatelessFunctionalComponent<Props> = ({
  sidebarType,
  setSidebarType,
  selectedProjectId,
  sidebarFiltersOpen,
}: Props): Node => (
  <SidebarWrapper>
    <ProjectPicker />
    <SidebarHeader
      sidebarType={sidebarType}
      setSidebarType={setSidebarType}
    />
    <SidebarContainer>
      {sidebarType === 'all' &&
        <SidebarSearch />
      }
      {sidebarFiltersOpen &&
        <SidebarFilters />
      }
      {selectedProjectId ?
        <SidebarItems /> :
        <SidebarNothingSelected>
          <span>Select project from dropdown above</span>
        </SidebarNothingSelected>
      }
    </SidebarContainer>
  </SidebarWrapper>
);

function mapStateToProps(state) {
  return {
    sidebarType: getSidebarType(state),
    selectedProjectId: getSelectedProjectId(state),
    sidebarFiltersOpen: getSidebarFiltersOpen(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(uiActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
