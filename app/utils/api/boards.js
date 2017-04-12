import jira from '../jiraClient';

export function fetchAllBoards() {
  return jira.client.board.getAllBoards({
    startAt: 0,
    maxResults: 1000,
    type: 'scrum',
  });
}
