// @flow
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Flex } from 'components';

import type { StatelessFunctionalComponent, Node } from 'react';

import { AlertModal, SettingsModal, SupportModal, AboutModal } from '../Modals';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';

// import Menu from './Menu/Menu';
// import Header from '../components/Base/Header/Header';

// import SettingsModal from '../components/Modals/SettingsModal/SettingsModal';
// import SupportModal from '../components/Modals/SupportModal/SupportModal';
// import AboutModal from '../components/Modals/AboutModal/AboutModal';

// import IssueView from './IssueView/IssueView';

// TODO: allow user to customize theme
const theme = { primary: '#0052CC' };

type Props = {};

const Main: StatelessFunctionalComponent<Props> = (): Node =>
  <ThemeProvider theme={theme}>
    <Flex row style={{ height: '100%' }}>
      <AlertModal />
      <SettingsModal />
      <SupportModal />
      <AboutModal />
      <Flex column style={{ width: 435 }}>
        <Header />
        <Sidebar />
      </Flex>
    </Flex>
  </ThemeProvider>;

export default Main;

/*
 *     <Flex row>
 *       <AlertModal />
 *       <SettingsModal />
 *       <SupportModal />
 *       <AboutModal />
 * 
 *       <Flex column>
 *         <Header />
 *         <Menu />
 *       </Flex>
 * 
 *       <IssueView />
 *     </Flex>
 */
