// @flow
import type {
  Id,
} from 'types';

import client from './client';

export function fetchSprints({ boardId }: { boardId: Id }): Promise<*> {
  return client.getSprintsForBoard({
    boardId,
    queryParameters: {
      state: 'active',
      startAt: 0,
      maxResults: 1000,
    },
  });
}
