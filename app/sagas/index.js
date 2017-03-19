import { fork } from 'redux-saga/effects';

import { loginFlow, checkJWT } from './profile';
import { getProjects } from './projects';


export default function* root() {
  yield [
    fork(loginFlow),
    fork(checkJWT),
    fork(getProjects),
  ];
}
