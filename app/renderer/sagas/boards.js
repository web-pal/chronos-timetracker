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
} from 'utils/external-open-util';

import * as Api from 'api';

import {
  throwError,
  notify,
} from './ui';


// For cases when server don't send total
function* fetchAllBoardsWithoutTotal({
  startAt = 0,
  maxResults = 50,
}: {
  startAt: number,
  maxResults: number,
}): Generator<*, *, *> {
  const response = yield call(
    Api.fetchBoards,
    {
      startAt,
      maxResults,
    },
  );
  if (response.isLast) {
    return [response];
  }
  const responses = yield call(
    fetchAllBoardsWithoutTotal,
    {
      startAt: startAt + response.values.length,
      maxResults,
    },
  );
  return [response, ...responses];
}

function* fetchAllBoards({
  startAt = 0,
  maxResults = 50,
}: {
  startAt: number,
  maxResults: number,
}): Generator<*, void, *> {
  const response = yield call(
    Api.fetchBoards,
    {
      startAt,
      maxResults,
    },
  );
  if (!response.isLast) {
    const additionalBoards =
      // Some servers do not send total
      response.total ?
        yield all(
          Array.from(Array(Math.ceil(response.total / maxResults)).keys()).map(
            i =>
              call(Api.fetchBoards, {
                startAt: (i + 1) * maxResults,
                maxResults,
              }),
          ),
        ) :
        yield call(fetchAllBoardsWithoutTotal, {
          startAt: maxResults,
          maxResults,
        });
    return [...response.values].concat(...additionalBoards.map(b => b.values));
  }
  return response.values;
}

export function* fetchBoards(): Generator<*, void, *> {
  try {
    const actions = createActionCreators('read', {
      resourceType: 'boards',
      request: 'allBoards',
      list: 'allBoards',
    });
    yield put(actions.pending());
    const boards = yield call(
      fetchAllBoards,
      {
        startAt: 0,
        maxResults: 50,
      },
    );
    const boardsWithoutProjects = boards.filter(b => !b.location);
    // In some jira servers boards without location(project), so we have to fetch it additionaly
    const projects = yield all(boardsWithoutProjects.map(b => call(Api.fetchBoardProjects, b.id)));
    try {
      yield put(actions.succeeded({
        resources: boards.map(
          (b, index) => (
            (
              projects[index] &&
              projects[index].values &&
              projects[index].values[0] &&
              projects[index].values[0].id
            ) ?
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
          boards,
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
