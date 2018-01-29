// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';
import {
  bindActionCreators,
} from 'redux';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

import {
  uiActions,
} from 'actions';
import {
  getProjectsFetching,
  getSidebarType,
  getSelectedProjectId,
  getSidebarFiltersOpen,
} from 'selectors';

import IssuesSourcePicker from './IssuesSourcePicker';
import SidebarIssues from './SidebarIssues';
import SidebarRecentWorklogs from './SidebarRecentWorklogs';

import {
  SidebarContainer,
  TabContainer,
  ListContainer,
  Tab,
} from './styled';

import type {
  SetSidebarType,
  SidebarType,
} from '../../types';


type Props = {
  sidebarType: SidebarType,
  setSidebarType: SetSidebarType,
};

const Sidebar: StatelessFunctionalComponent<Props> = ({
  sidebarType,
  setSidebarType,
}: Props): Node => (
  <SidebarContainer>
    <IssuesSourcePicker />
    <TabContainer>
      <Tab
        active={sidebarType === 'recent'}
        onClick={() => setSidebarType('recent')}
      >
        Recent worklogs
      </Tab>
      <Tab
        active={sidebarType === 'all'}
        onClick={() => setSidebarType('all')}
      >
        Issues
      </Tab>
    </TabContainer>
    <ListContainer sidebarType={sidebarType}>
      <SidebarRecentWorklogs />
      <SidebarIssues />
    </ListContainer>
  </SidebarContainer>
);

function mapStateToProps(state) {
  return {
    projectsFetching: getProjectsFetching(state),
    sidebarType: getSidebarType(state),
    selectedProjectId: getSelectedProjectId(state),
    sidebarFiltersOpen: getSidebarFiltersOpen(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(uiActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
