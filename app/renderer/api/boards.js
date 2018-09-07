// @flow
import jira from 'utils/jiraClient';

// maxResults 50 - it's maximum
export function fetchBoards({
  startAt = 0,
  maxResults = 50,
}: {
  startAt: number,
  maxResults: number,
}): Promise<*> {
  return jira.client.board.getAllBoards({
    startAt,
    maxResults,
  });
}

export function fetchBoardProjects(boardId: string | number): Promise<*> {
  return jira.client.board.getProjectsForBoard({
    boardId,
    startAt: 0,
    maxResults: 1000,
  });
}
