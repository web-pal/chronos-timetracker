// @flow
import config from 'config';
import { getHeaders } from './helper';


export async function fetchSettings(): Promise<*> {
  const url = `${config.apiUrl}/api/tracker/settings/desktopApp`;
  return fetch(url, { headers: await getHeaders() }).then(res => res.json());
}
