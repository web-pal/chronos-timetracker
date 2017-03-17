let token = null;

export function getHeaders() {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  return headers;
}

export function rememberToken(newToken) {
  token = newToken;
}
