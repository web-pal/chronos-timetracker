import jira from '../jiraClient';

export function fetchSprints({ boardId }) {
  console.log('jira.client.board.getSprintsForBoard', jira.client.board);
  return jira.client.board.getSprintsForBoard({
    startAt: 0,
    maxResults: 1000,
    boardId,
  });
}
