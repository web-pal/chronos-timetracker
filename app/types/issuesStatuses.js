// @flow
import type {
  Id,
} from './';

export type IssueStatusCategory = {
  colorName: string,
  id: number,
  key: string,
  name: string,
  self: string,
};

export type IssueStatus = {
  description: string,
  iconUrl: string,
  id: string,
  name: string,
  self: string,
  statusCategory: IssueStatusCategory,
};

export type IssuesStatusesResources = {
  [Id]: IssueStatus,
}

export type IssuesStatusesState = any;
