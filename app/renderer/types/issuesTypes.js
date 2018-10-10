// @flow
import type {
  Id,
} from './';


export type IssueType = {
  avatarId?: number,
  description: string,
  iconUrl: string,
  id: string,
  name: string,
  self: string,
  subtask?: boolean
};

export type IssuesTypesResources = {
  [Id]: IssueType,
}

export type IssuesTypesState = any;
