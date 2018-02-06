// @flow
import type {
  Id,
} from './';

export type Board = {
  id: number,
  location: {
    avatarURI: string,
    name: string,
    projectId: number,
    projectTypeKey: string,
  },
  name: string,
  self: string,
  type: string,
};

export type BoardsResources = {
  [Id]: Board,
}
