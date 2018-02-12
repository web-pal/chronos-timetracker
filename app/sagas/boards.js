// @flow
import {
  put,
  call,
  fork,
  all,
} from 'redux-saga/effects';
import Raven from 'raven-js';

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
    const boardsWithoutProjects = response.values.filter(b => !b.location);
    // In some jira servers boards without location(project), so we have to fetch it additionaly
    const projects = yield all(boardsWithoutProjects.map(b => call(Api.fetchBoardProjects, b.id)));
    try {
      yield put(actions.succeeded({
        resources: response.values.map(
          (b, index) => (
            projects[index] ?
              {
                ...b,
                location: {
                  ...projects[index].values[0],
                  projectId: projects[index].values[0].id,
                },
              } :
              b
          ),
        ),
      }));
    } catch (e) {
      Raven.captureMessage('Boards structure error!', {
        level: 'error',
        extra: {
          boards: response,
          projects,
        },
      });
      throw e;
    }
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
      yield fork(notify, {
        title: 'Can not load boards',
        actions: flagActions,
      });
    }
  }
}
