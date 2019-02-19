import * as eff from 'redux-saga/effects';
import * as Api from 'api';

import {
  infoLog,
} from './ui';


export function* getWorklogTypes() {
  try {
    const { payload } = yield eff.call(Api.fetchWorklogTypes);
    yield eff.call(infoLog, 'got worklog types', payload);
  } catch (err) {
    console.log(err);
  }
}

