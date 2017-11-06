import { apiUrl } from 'config';
import { getHeaders } from './helper';

export async function fetchSettings() {
  const url = `${apiUrl}/api/tracker/settings/desktopApp`;
  return fetch(url, { headers: await getHeaders() }).then(res => res.json());
}
