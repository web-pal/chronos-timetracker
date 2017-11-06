import { call } from 'redux-saga/effects';
import * as Api from 'api';
import Raven from 'raven-js';

export function* getWorklogTypes() {
  try {
    const { payload } = yield call(Api.fetchWorklogTypes);
    // yield put(worklogTypesActions.fill);
  } catch (err) {
    Raven.captureException(err);
  }
}
