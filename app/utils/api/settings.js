// @flow
import { apiUrl } from '../config';
import { getHeaders } from './helper';

// eslint-disable-next-line import/prefer-default-export
export async function fetchSettings(): Promise<*> {
  const url = `${apiUrl}/api/tracker/settings/desktopApp`;
  return fetch(url, { headers: await getHeaders() }).then(res => res.json());
}
