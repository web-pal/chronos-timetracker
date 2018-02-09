// @flow
import jira from '../jiraClient';

export function fetchAllBoards(): Promise<*> {
  return jira.client.board.getAllBoards({
    startAt: 0,
    maxResults: 1000,
  });
}

export function fetchBoardProjects(boardId: string | number): Promise<*> {
  return jira.client.board.getProjectsForBoard({
    boardId,
    startAt: 0,
    maxResults: 1000,
  });
}
