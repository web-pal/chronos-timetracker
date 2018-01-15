// @flow
import React from 'react';
import { connect } from 'react-redux';
import { getAuthorized } from 'selectors';
import Spinner from '@atlaskit/spinner';

import type {
  Node,
  StatelessFunctionalComponent,
} from 'react';

import {
  AppWrapper,
  FullPageSpinner,
} from 'styles';
import AuthForm from './AuthForm';
import Main from './Main';

import type { State } from '../types';

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
      <div>
        {props.isAuthorized ?
          <Main /> :
          <AuthForm />
        }
      </div>
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
