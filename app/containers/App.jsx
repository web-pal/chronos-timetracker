// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';

import type {
  Node,
  StatelessFunctionalComponent,
} from 'react';

import Spinner from '@atlaskit/spinner';
import {
  getAuthorized,
} from 'selectors';
import {
  MaxHeight,
  AppWrapper,
  FullPageSpinner,
} from 'styles';
import AuthForm from './AuthForm';
import Main from './Main';

import type {
  State,
} from '../types';


type Props = {
  isAuthorized: boolean,
  initializeInProcess: boolean,
};

const App: StatelessFunctionalComponent<Props> = (props: Props): Node => (
  <AppWrapper>
    {props.initializeInProcess ?
      <FullPageSpinner>
        <Spinner size="xlarge" />
      </FullPageSpinner> :
      <MaxHeight>
        {props.isAuthorized ?
          <Main /> :
          <AuthForm />
        }
      </MaxHeight>
    }
  </AppWrapper>
);

function mapStateToProps(state: State): Props {
  return {
    isAuthorized: getAuthorized(state),
    initializeInProcess: state.ui.initializeInProcess,
  };
}

export default connect(mapStateToProps)(App);
