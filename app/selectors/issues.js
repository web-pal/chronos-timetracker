// @flow
import type { IssuesState, IssuesMap, Id } from '../types';

export const getIssuesIds =
  ({ issues }: { issues: IssuesState }): Array<Id> => issues.allIds;

export const getIssuesMap =
  ({ issues }: { issues: IssuesState }): IssuesMap => issues.byId;

export const getIssuesFetching =
  ({ issues }: { issues: IssuesState }): boolean => issues.meta.fetching;

export const getIssuesTotalCount =
  ({ issues }: { issues: IssuesState }): number => issues.meta.totalCount;
