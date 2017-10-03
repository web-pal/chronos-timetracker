import { getFromStorage } from '../../sagas/storage';

// eslint-disable-next-line import/prefer-default-export
export async function getHeaders() {
  const token = await getFromStorage('desktop_tracker_jwt');
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  return headers;
}
