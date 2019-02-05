import {
  all,
  fork,
} from 'redux-saga/effects';

import {
  initialize,
} from './initialize';

import {
  updaterFlow,
} from './updater';

export default function* rootSaga() {
  yield all([
    fork(initialize),
    fork(updaterFlow),
  ]);
}
