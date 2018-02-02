// @flow
import {
  put,
  call,
} from 'redux-saga/effects';

import createActionCreators from 'redux-resource-action-creators';
import {
  openURLInBrowser,
} from 'external-open-util';

import * as Api from 'api';

import {
  throwError,
  notify,
} from './ui';


export function* fetchBoards(): Generator<*, void, *> {
  try {
    const actions = createActionCreators('read', {
      resourceName: 'boards',
      request: 'allBoards',
      list: 'allBoards',
    });
    yield put(actions.pending());
    const response = yield call(Api.fetchAllBoards);
    yield put(actions.succeeded({
      resources: response.values,
    }));
  } catch (err) {
    yield call(throwError, err);
    if (JSON.parse(err).statusCode === 403) {
      const helpUrl =
        'https://web-pal.atlassian.net/wiki/spaces/CHRONOS/pages/173899778/Problem+with+loading+boards';
      const flagActions = [
        {
          content: 'How to resolve this?',
          onClick: openURLInBrowser(helpUrl),
        },
      ];
      yield call(notify, '', 'Can not load boards', flagActions);
    } else {
      console.log(err);
    }
  }
}
