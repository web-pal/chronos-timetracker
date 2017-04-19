import jira from '../jiraClient';

export function fetchSprints({ boardId }) {
  return jira.client.board.getSprintsForBoard({
    startAt: 0,
    maxResults: 1000,
    boardId,
    state: 'active',
  });
}
