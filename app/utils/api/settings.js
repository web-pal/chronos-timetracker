import { apiUrl } from 'config';
import { getHeaders } from './helper';


export function fetchSettings() { // eslint-disable-line
  const url = `${apiUrl}/api/tracker/settings/desktopApp`;
  return fetch(url, { headers: getHeaders() }).then(res => res.json());
}
