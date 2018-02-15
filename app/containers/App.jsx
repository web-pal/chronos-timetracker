// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';

import type {
  Node,
  StatelessFunctionalComponent,
} from 'react';
import type {
  Connector,
} from 'react-redux';

import Spinner from '@atlaskit/spinner';
import {
  getUiState,
} from 'selectors';
import {
  MaxHeight,
  AppWrapper,
  FullPageSpinner,
} from 'styles';
import {
  ErrorBoundary,
} from 'components';
import AuthForm from './AuthForm';
import Main from './Main';
import FlagsContainer from './FlagsContainer';


type Props = {
  isAuthorized: boolean,
  initializeInProcess: boolean,
};

const App: StatelessFunctionalComponent<Props> = (props: Props): Node => (
  <ErrorBoundary
    debugData={{
      props,
    }}
  >
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
      <FlagsContainer />
    </AppWrapper>
  </ErrorBoundary>
);

function mapStateToProps(state): Props {
  return {
    isAuthorized: getUiState('authorized')(state),
    initializeInProcess: getUiState('initializeInProcess')(state),
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(App);
