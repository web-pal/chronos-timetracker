// @flow
import http from 'http';
import apiFactory from 'chronos-core';

const makeRequest = (url, options, debug) => {
  const { protocol, hostname, port, pathname, search } = url;
  const { method, headers } = options;
  return new Promise((resolve, reject) => {
    const req = http.request({
      protocol,
      hostname,
      port,
      path: `${pathname}${search || ''}`,
      method,
      headers,
    });

    req.on('response', (response) => {
      response.setEncoding('utf8');
      // Saving error
      const error = response.statusCode.toString()[0] !== '2';

      // Collecting data
      const body = [];
      const push = body.push.bind(body);
      response.on('data', push);

      response.on('end', () => {
        let result = body.join('');

        // Parsing JSON
        if (result[0] === '[' || result[0] === '{') {
          try {
            result = JSON.parse(result);
          } catch (e) {
            // nothing to do
          }
        }

        if (error) {
          response.body = result;
          if (debug) {
            /* eslint-disable-next-line */
            reject({
              result: JSON.stringify(response),
              debug: {
                options,
                request: {
                  headers,
                },
                response: {
                  headers: response.headers,
                },
              },
            });
          } else {
            reject(JSON.stringify(response));
          }
          return;
        }

        if (debug) {
          resolve({
            result,
            debug: {
              options,
              request: {
                headers,
              },
              response: {
                headers: response.headers,
              },
            },
          });
        } else {
          resolve(result);
        }
      });

      req.on('error', reject);
    });

    req.on('error', (e) => {
      console.log(`problem with request: ${e.message}`);
    });

    if (options.body) {
      // write data to request body
      req.write(options.body);
    }

    req.end();
  });
};

const client = apiFactory({
  makeRequest,
});

export const getBaseUrl = ({
  protocol,
  hostname,
  port,
  pathname,
}) => {
  const p = port ? `:${port}` : '';
  return `${protocol}://${hostname}${p}${pathname.replace(/\/$/, '')}`;
};

export const configureApi = ({
  protocol,
  hostname,
  port,
  pathname,
  cookies,
}) => {
  const baseUrl = getBaseUrl({ protocol, hostname, port, pathname });
  client.setBaseUrl(baseUrl);
  if (cookies && cookies.length) {
    client.setHeaders({
      cookie: cookies.map(
        cookie => `${cookie.name}=${cookie.value};`,
      ).join(' '),
    });
  }
};

export default client;
