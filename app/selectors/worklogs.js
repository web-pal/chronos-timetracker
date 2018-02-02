// @flow
import {
  createSelector,
} from 'reselect';

import type {
  WorklogsState,
  Worklog,
  Id,
} from '../types';

import {
  getSelectedIssue,
} from './issues2';


export const getWorklogComment =
  ({ worklogs }: { worklogs: WorklogsState }): string => worklogs.meta.worklogComment;

export const getEditingWorklog =
  ({ worklogs }: { worklogs: WorklogsState }): Worklog | null => worklogs.meta.editingWorklog;

export const getTemporaryWorklogId =
  ({ worklogs }: { worklogs: WorklogsState }): Id | null => worklogs.meta.temporaryWorklogId;
