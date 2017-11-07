// @flow
import { createSelector } from 'reselect';
import type { WorklogsState, Worklog, Id } from '../types';
import { getSelectedIssue } from './issues';

export const getWorklogComment =
  ({ worklogs }: { worklogs: WorklogsState }): string => worklogs.meta.worklogComment;

export const getEditWorklogFetching =
  ({ worklogs }: { worklogs: WorklogsState }): boolean => worklogs.meta.editWorklogFetching;

export const getEditingWorklog =
  ({ worklogs }: { worklogs: WorklogsState }): Worklog | null => worklogs.meta.editingWorklog;

export const getSelectedWorklogId =
  ({ worklogs }: { worklogs: WorklogsState }): Id | null => worklogs.meta.selectedWorklogId;

export const getWorklogListScrollIndex = createSelector(
  [getSelectedWorklogId, getSelectedIssue],
  (selectedWorklogId, issue) => {
    if (!issue) return 0;
    const worklogs = issue.fields.worklog.worklogs;
    if (!worklogs.findIndex) return 0;
    return worklogs.findIndex((w) => w.id === selectedWorklogId);
  },
);
