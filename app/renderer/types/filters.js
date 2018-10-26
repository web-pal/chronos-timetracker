// @flow
import type {
  Id,
  User,
} from './';

export type Filter = {
  assignee: Array<string>,
  status: Array<string>,
  type: Array<string>,
};

export type JIRAFilter = {
  self: string,
  id: Id,
  name: string,
  owner: User,
  jql: string,
  viewUrl: string,
  searchUrl: string,
  favourite: boolean,
  favouritedCount: number,
  sharePermissions: Array<any>,
  sharedUsers: {
    size: number,
    items: Array<any>,
    max-results: number,
    start-index: number,
    end-index: number,
  },
  subscriptions: {
    size: number,
    items: Array<any>,
    max-results: number,
    start-index: number,
    end-index: number,
  },
};

export type FiltersResources = {
  [Id]: JIRAFilter,
};
