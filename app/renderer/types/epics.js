// @flow

export type Epic = {
  id: string,
  self: string,
  name: string,
  summary: string,
  color: {
    key: string,
  },
  done: boolean,
};
