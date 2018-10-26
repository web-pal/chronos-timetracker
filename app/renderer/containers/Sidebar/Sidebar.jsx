// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';
import type {
  Connector,
} from 'react-redux';
import type {
  Dispatch,
} from 'types';

import {
  uiActions,
} from 'actions';
import {
  getUiState,
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


type Props = {
  sidebarType: string,
  dispatch: Dispatch,
};

const Sidebar: StatelessFunctionalComponent<Props> = ({
  sidebarType,
  dispatch,
}: Props): Node => (
  <SidebarContainer>
    <IssuesSourcePicker />
    <TabContainer>
      <Tab
        active={sidebarType === 'recent'}
        onClick={() => {
          dispatch(
            uiActions.setUiState('sidebarType', 'recent'),
          );
        }}
      >
        Recent worklogs
      </Tab>
      <Tab
        active={sidebarType === 'all'}
        onClick={() => {
          dispatch(
            uiActions.setUiState('sidebarType', 'all'),
          );
        }}
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
    sidebarType: getUiState('sidebarType')(state),
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(Sidebar);
