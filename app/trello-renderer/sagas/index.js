import * as eff from 'redux-saga/effects';

import {
  initialize,
} from './initialize';


export default function* rootSaga() {
  yield eff.all([
    eff.fork(initialize),
  ]);
}
