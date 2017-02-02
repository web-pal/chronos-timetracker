
export function success(payload = {}) {
  return {
    success: true,
    error: null,
    payload: { ...payload },
  };
}

export function fail(error = new Error()) {
  return {
    success: false,
    error,
    payload: {},
  };
}
