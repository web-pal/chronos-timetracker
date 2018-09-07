// @flow

import type {
  Id,
} from 'types';

import jira from 'utils/jiraClient';


export function fetchSprints({ boardId }: { boardId: Id }): Promise<*> {
  return jira.client.board.getSprintsForBoard({
    startAt: 0,
    maxResults: 1000,
    boardId,
    state: 'active',
  });
}
