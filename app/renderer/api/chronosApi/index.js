import config from 'config';

function apiFactory({ makeRequest }) {
  const apiCommonMethods = [
    ['getJWT', '/getJWT', 'POST'],
    ['signBucketUrl', '/signBucketUrl', 'POST'],
  ];

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  let mockMethods = {};

  function fillUrlTemplate(
    template,
    templateVars,
  ) {
    const re = new RegExp('{', 'g');
    return (
      new Function( /* eslint-disable-line */
        `return \`${template.replace(re, '${this.')}\`;`,
      ).call(templateVars)
    );
  }

  function buildQueryUrl(
    params = {},
    endpointUrl,
  ) {
    const urlInstance = new URL(
      `${config.apiUrl}${fillUrlTemplate(endpointUrl, params)}`,
    );

    urlInstance.search = new URLSearchParams(params);
    return urlInstance.toString();
  }

  function performFetch({
    methodName,
    endpointUrl,
    method,
    params,
    body,
  }) {
    const url = buildQueryUrl(
      params,
      endpointUrl,
    );

    if (mockMethods[methodName]) {
      return mockMethods[methodName]({
        ...params,
        url,
        endpointUrl,
      });
    }

    return makeRequest(
      url,
      {
        method,
        headers,
        ...(
          Object.keys(body).length
            ? ({
              body: JSON.stringify(body),
            })
            : {}
        ),
      },
    );
  }

  return ({
    setMockMethods(
      mockObject,
      merge = true,
    ) {
      mockMethods = merge ? {
        ...mockMethods,
        ...mockObject,
      } : mockObject;

      return mockMethods;
    },

    clearMockMethods() {
      mockMethods = {};
      return mockMethods;
    },

    setJWT(jwt) {
      headers.Authorization = `Bearer ${jwt}`;
    },

    uploadScreenshotOnS3Bucket({
      url,
      image,
    }) {
      return makeRequest(
        url,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'image/jpeg',
          },
          body: image,
        },
      );
    },

    ...(
      apiCommonMethods.reduce((
        acc,
        [
          methodName,
          endpointUrl,
          method = 'GET',
        ],
      ) => ({
        ...acc,
        [methodName]({
          params = {},
          body = {},
        } = {
          params: {},
          body: {},
        }) {
          return performFetch({
            methodName,
            endpointUrl,
            method,
            params,
            body,
          });
        },
      }), {})
    ),
  });
}

export default apiFactory;
