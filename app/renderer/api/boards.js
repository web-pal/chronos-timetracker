// @flow
import client from './client';

// maxResults 50 - it's maximum
export function fetchBoards({
  startAt = 0,
  maxResults = 50,
}: {
  startAt: number,
  maxResults: number,
}): Promise<*> {
  return client.getAllBoards({
    queryParameters: {
      startAt,
      maxResults,
    },
  });
}

export function fetchBoardProjects(boardId: string | number): Promise<*> {
  return client.getProjectsForBoard({
    boardId,
    queryParameters: {
      startAt: 0,
      maxResults: 1000,
    },
  });
}
