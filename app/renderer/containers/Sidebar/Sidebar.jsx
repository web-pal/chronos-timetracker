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

import * as S from './styled';


type Props = {
  sidebarType: string,
  dispatch: Dispatch,
};

const Sidebar: StatelessFunctionalComponent<Props> = ({
  sidebarType,
  dispatch,
}: Props): Node => (
  <S.Sidebar>
    <IssuesSourcePicker />
    <S.Tab>
      <S.TabDesc
        active={sidebarType === 'recent'}
        onClick={() => {
          dispatch(uiActions.setUiState({
            sidebarType: 'recent',
          }));
        }}
      >
        Recent worklogs
      </S.TabDesc>
      <S.TabDesc
        active={sidebarType === 'all'}
        onClick={() => {
          dispatch(
            uiActions.setUiState({
              sidebarType: 'all',
            }),
          );
        }}
      >
        Issues
      </S.TabDesc>
    </S.Tab>
    <S.List sidebarType={sidebarType}>
      <SidebarRecentWorklogs />
      <SidebarIssues />
    </S.List>
  </S.Sidebar>
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
