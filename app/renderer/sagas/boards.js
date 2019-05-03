// @flow

import * as eff from 'redux-saga/effects';
import createActionCreators from 'redux-resource-action-creators';
import {
  openURLInBrowser,
} from 'utils/external-open-util';

import {
  jiraApi,
} from 'api';

import {
  throwError,
  notify,
} from './ui';


/* For cases when server don't send total */
function* fetchAllBoardsWithoutTotal({
  startAt = 0,
  maxResults = 50,
} = {
  startAt: 0,
  maxResults: 50,
}): Generator<*, *, *> {
  const response = yield eff.call(
    jiraApi.getAllBoards,
    {
      params: {
        startAt,
        maxResults,
      },
    },
  );
  if (response.isLast) {
    return [response];
  }
  const responses = yield eff.call(
    fetchAllBoardsWithoutTotal,
    {
      startAt: startAt + response.values.length,
      maxResults,
    },
  );
  return [response, ...responses];
}

export function* fetchBoards(): Generator<*, void, *> {
  try {
    const actions = createActionCreators('read', {
      resourceType: 'boards',
      request: 'allBoards',
      list: 'allBoards',
    });
    yield eff.put(actions.pending());

    let boards = [];
    const response = yield eff.call(
      jiraApi.getAllBoards,
      {
        params: {
          startAt: 0,
          maxResults: 50,
        },
      },
    );
    if (!response.isLast) {
      const additionalBoards = (
        /* Some servers do not send total */
        response.total
          ? (
            yield eff.all(
              Array.from(Array(Math.floor(response.total / response.maxResults)).keys()).map(
                i => (
                  eff.call(
                    jiraApi.getAllBoards,
                    {
                      params: {
                        startAt: (i + 1) * response.maxResults,
                        maxResults: 50,
                      },
                    },
                  )
                ),
              ),
            )
          ) : (
            /* Test it */
            yield eff.call(fetchAllBoardsWithoutTotal)
          )
      );
      boards = (
        [...response.values]
          .concat(
            ...additionalBoards.map(b => b.values),
          )
      );
    } else {
      boards = response.values;
    }
    const boardsWithoutProjects = boards.filter(b => !b.location);
    /* In some jira servers boards without location(project), so we have to fetch it additionaly */
    const projectsResponse = (
      yield eff.all(
        boardsWithoutProjects.reduce(
          (acc, b) => ({
            ...acc,
            [b.id]: (
              eff.call(
                jiraApi.getBoardProjects,
                {
                  params: {
                    boardId: b.id,
                  },
                },
              )
            ),
          }),
          {},
        ),
      )
    );
    const additionalProjects = (
      yield eff.all(
        Object.keys(projectsResponse)
          .filter(
            boardId => (
              projectsResponse[boardId].total
              > projectsResponse[boardId].startAt + projectsResponse[boardId].maxResults
            ),
          )
          .reduce(
            (acc, bId) => ({
              ...acc,
              [bId]: (
                eff.all(
                  Array.from(
                    Array(
                      Math.floor(projectsResponse[bId].total / projectsResponse[bId].maxResults),
                    ).keys(),
                  ).map(
                    i => (
                      eff.call(
                        jiraApi.getBoardProjects,
                        {
                          params: {
                            boardId: bId,
                            startAt: (i + 1) * projectsResponse[bId].maxResults,
                          },
                        },
                      )
                    ),
                  ),
                )
              ),
            }),
            {},
          ),
      )
    );
    const boardsProjects = (
      Object.keys(projectsResponse).reduce(
        (acc, boardId) => ({
          ...acc,
          [boardId]: [
            ...projectsResponse[boardId].values,
          ].concat(
            ...(additionalProjects[boardId] || []).map(r => r.values),
          ),
        }),
        {},
      )
    );
    yield eff.put(actions.succeeded({
      resources: (
        boards.map(
          board => (
            board.location
              ? board
              : {
                ...board,
                ...(
                  boardsProjects[board.id]?.length
                    ? {
                      location: {
                        ...boardsProjects[board.id][0],
                        projectId: boardsProjects[board.id][0].id,
                      },
                    } : {}
                ),
              }
          ),
        )
      ),
    }));
  } catch (err) {
    throwError(err);
    if (err?.response?.statusCode === 403) {
      const helpUrl = (
        'https://web-pal.atlassian.net/wiki/spaces/CHRONOS/pages/173899778/Problem+with+loading+boards'
      );
      const flagActions = [
        {
          content: 'How to resolve this?',
          onClick: openURLInBrowser(helpUrl),
        },
      ];
      yield eff.fork(notify, {
        title: 'Can not load boards',
        actions: flagActions,
      });
    }
  }
}
