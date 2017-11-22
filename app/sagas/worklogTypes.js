import { call } from 'redux-saga/effects';
import * as Api from 'api';
import Raven from 'raven-js';
import { infoLog } from './ui';

export function* getWorklogTypes() {
  try {
    const { payload } = yield call(Api.fetchWorklogTypes);
    yield call(infoLog, 'got worklog types', payload);
    // yield put(worklogTypesActions.fill);
  } catch (err) {
    Raven.captureException(err);
  }
}
