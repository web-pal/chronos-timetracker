// @flow
import type { WorklogsState } from '../types';

export const getWorklogComment =
  ({ worklogs }: { worklogs: WorklogsState }): string => worklogs.meta.worklogComment;
export const getAddWorklogFetching =
  ({ worklogs }: { worklogs: WorklogsState }): boolean => worklogs.meta.addWorklogFetching;
