/**
 * Custom Error constructor.  It is meant to throw with fetch() Response
 * and JSON object received from the server with additional data about the error.
 * JSON and Response objects will be attached to the context of the constructor.
 *
 * @constructor
 * @param {Object} ctx - Error context object
 * @param ctx.json - JSON response received from the server
 * @param ctx.response - fetch() Response object
 */
function EnhancedFetchError({
  json,
  response,
}) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = (new Error()).stack || '';
  }
  this.json = json;
  this.response = response;
}


/**
 * A wrraper around the cross-fetch() lib which handles Promise results and either
 * returns JSON response or throws an error({@link EnhancedFetchError}).
 *
 * Promise style was used because the function is intended to be called
 * inside generators(sagas), so async/awayt function can not be used.
 *
 * cross-fetch() is a platform agnostic fetch implementation:
 * browsers, node or react native.
 *
 * Read more about fetch() params
 * [here.]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters}
 *
 * @param input Request url
 * @param init Request configuration object
 *
 * @see https://github.com/lquixada/cross-fetch
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters
 * @see EnhancedFetchError
 */
export default function enhancedFetch(
  input,
  init,
) {
  return fetch(
    input,
    {
      ...init,
      credentials: 'include',
    },
  ).then(
    (response) => {
      if (response.status === 404) {
        throw new EnhancedFetchError({
          response,
        });
      }
      if (response.status === 204) {
        return ({
          dataType: 'text',
          response,
        });
      }
      if (
        (response.headers.get('content-Type') || '')
          .toLowerCase()
          .includes('application/json')
      ) {
        return response.json().then(json => ({
          response,
          dataType: 'json',
          json,
        }));
      }
      if (response.ok) {
        throw new TypeError("Oops, we haven't got JSON!");
      }
      throw new Error(response.statusText || response.status);
    },
    // A network error or another reason why the HTTP request couldn't be fulfilled
    (err) => {
      throw err;
    },
  )
    .then(({
      response,
      dataType,
      json,
    }) => {
      if (dataType === 'text') {
        return response.statusText;
      }
      if (response.ok) {
        return json;
      }
      throw new EnhancedFetchError({
        response,
        json,
      });
    });
}
