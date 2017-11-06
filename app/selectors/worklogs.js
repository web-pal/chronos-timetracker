// @flow
import type { WorklogsState, Worklog } from '../types';

export const getWorklogComment =
  ({ worklogs }: { worklogs: WorklogsState }): string => worklogs.meta.worklogComment;

export const getEditWorklogFetching =
  ({ worklogs }: { worklogs: WorklogsState }): boolean => worklogs.meta.editWorklogFetching;

export const getEditingWorklog =
  ({ worklogs }: { worklogs: WorklogsState }): Worklog | null => worklogs.meta.editingWorklog;
