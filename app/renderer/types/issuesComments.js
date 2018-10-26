// @flow
import type {
  Id,
  User,
} from './';


export type IssueComment = {
  self: string,
  id: string,
  author: User,
  body: string,
  updateAuthor: User,
  created: string,
  updated: string,
  visibility: {
    type: string,
    value: string,
  },
};

export type IssuesCommentsResources = {
  [Id]: IssueComment,
}

export type IssuesCommentsState = any;
