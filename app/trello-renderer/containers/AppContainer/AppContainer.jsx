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
} from 'trello-components';


type Props = {
  initializeInProcess: boolean,
  isAuthorized: boolean,
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
  console.log('----');
  console.log(initializeInProcess);
  console.log(isAuthorized);
  console.log('----');

  return (
    <div>
      Trello app
      <TestComponent />
    </div>
  );
};

export default AppContainer;
