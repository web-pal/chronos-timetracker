import {
  call,
} from 'redux-saga/effects';

import * as Api from 'api';

import {
  infoLog,
} from './ui';


export function* getWorklogTypes() {
  try {
    const { payload } = yield call(Api.fetchWorklogTypes);
    yield call(infoLog, 'got worklog types', payload);
    // yield put(worklogTypesActions.fill);
  } catch (err) {
    console.log(err)
  }
}
