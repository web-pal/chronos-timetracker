import { fork } from 'redux-saga/effects';

import { loginFlow, checkJWT } from './profile';

export default function* root() {
  yield [
    fork(loginFlow),
    fork(checkJWT),
  ];
}
