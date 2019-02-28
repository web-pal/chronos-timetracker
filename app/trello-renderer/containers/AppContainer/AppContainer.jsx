// @flow
import React from 'react';
import {
  useDispatch,
  useMappedState,
} from 'redux-react-hook';

import type {
  Dispatch,
} from 'trello-types';

import * as selectors from 'trello-selectors';
import {
  TestComponent,
  AuthForm,
} from 'trello-components';

type Props = {
  initializeInProcess: boolean,
  isAuthorized: boolean,
  trelloApiKey: string,
};

const mapState: Props = state => ({
  ...selectors.getUiState([
    'initializeInProcess',
    'isAuthorized',
  ])(state),
});

const AppContainer = () => {
  const {
    initializeInProcess,
    isAuthorized,
  } = useMappedState(mapState);
  const dispatch: Dispatch = useDispatch();

  return (
    <div>
      {
        initializeInProcess
          ? (
            <div>
              Initialize...
            </div>
          )
          : (
            isAuthorized
              ? (
                <TestComponent />
              ) : (
                <AuthForm />
              )
          )
      }
    </div>
  );
};

export default AppContainer;
