import * as eff from 'redux-saga/effects';

import {
  initializeApp,
  takeInitialConfigureApp,
  handleQuitRequest,
} from './initialize';


export default function* rootSaga() {
  yield eff.all([
    eff.fork(handleQuitRequest),
    eff.fork(takeInitialConfigureApp),
    eff.fork(initializeApp),
  ]);
}
