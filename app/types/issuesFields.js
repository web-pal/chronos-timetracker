// @flow
import type {
  Id,
  User,
  IssueType,
  Project,
  Worklog,
  Epic,
  IssueStatus,
  IssueComment,
} from './';

export type Component = {
  self: string,
  id: string,
  name: string,
};

export type Version = {
  self: string,
  id: string,
  description: string,
  name: string,
  archived: boolean,
  released: boolean,
};

export type IssuePriority = {
  iconUrl: string,
  id: string,
  name: string,
  self: string,
};

export type IssueResolution = {
  self: string,
  id: string,
  description: string,
  name: string,
};

export type IssueWorklog = {
  startAt: number,
  maxResults: number,
  total: number,
  worklogs: Array<Worklog>,
};

export type IssueField = {
  summary: string,
  created: string,
  creator: User,
  issuetype: IssueType,
  components: Array<Component>,
  comment: Array<IssueComment>,
  timespent: number | null,
  description: string | null,
  duedate: string | null,
  environment: string | null,
  epic: Epic,
  issuelinks: Array<any>,
  lastViewed: string | null,
  project: Project,
  reporter: User,
  fixVersions: Array<Version>,
  priority: IssuePriority,
  resolution: IssueResolution | null,
  resolutiondate: string | null,
  labels: Array<string>,
  timeestimate: number | null,
  timeoriginalestimate: number | null,
  versions: Array<Version>,
  worklog: IssueWorklog,
  worklogs: Array<Id>,
  assignee: User | null,
  status: IssueStatus,
  subtasks: Array<any>,
  updated: string,
  votes: {
    hasVoted: boolean,
    self: string,
    votes: number,
  },
  watches: {
    isWatching: boolean,
    self: string,
    watchCount: number,
    workratio: number,
  },
};

export type IssuesFieldsResources = {
  [Id]: IssueField,
};

export type IssuesFieldsState = any;
