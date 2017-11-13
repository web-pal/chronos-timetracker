// @flow
import jira from '../jiraClient';

// eslint-disable-next-line import/prefer-default-export
export function fetchAllBoards(): Promise<*> {
  return jira.client.board.getAllBoards({
    startAt: 0,
    maxResults: 1000,
  });
}
