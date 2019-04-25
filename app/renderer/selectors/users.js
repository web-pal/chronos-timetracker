import {
  createSelector,
} from 'reselect';

export const getTeamStatusUsers = s => s.teamStatusReducer.teamStatusUsers;

export const getAllTimezonesOptions = createSelector(
  [
    s => s.teamStatusReducer.timezones,
  ],
  allTimezones => allTimezones.map(tz => ({ label: tz, value: tz })),
);
