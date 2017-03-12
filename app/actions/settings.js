import fetch from 'isomorphic-fetch';
import { staticUrl } from 'config';

import * as types from '../constants';

export const fetchSettings = () => (dispatch, getState) => new Promise((resolve) => {
  const token = getState().jira.jwt;
  const url = `${staticUrl}/api/tracker/settings/desktopApp`;
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  fetch(url, options)
    .then(
      res => res.status === 200 && res.json(),
    )
    .then(
      (json) => {
        dispatch({
          type: types.FILL_SETTINGS,
          payload: json.payload,
        });
        resolve();
      },
    );
});
