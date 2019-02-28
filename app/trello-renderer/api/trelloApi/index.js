function apiFactory({ makeRequest }) {
  const apiCommonMethods = [
    ['getMyself', '/members/me'],
  ];

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  let key = null;
  let token = null;
  const baseApiUrl = 'https://api.trello.com/1';
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
    baseUrl,
  ) {
    const urlInstance = new URL(
      `${baseUrl}${fillUrlTemplate(endpointUrl, params)}`,
    );

    urlInstance.search = new URLSearchParams({
      ...params,
      key,
      token,
    });
    return urlInstance.toString();
  }

  function performFetch({
    methodName,
    endpointUrl,
    baseUrl,
    method,
    params,
    body,
  }) {
    const url = buildQueryUrl(
      params,
      endpointUrl,
      baseUrl,
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
    setHeaders(newHeaders) {
      headers = newHeaders;
      return headers;
    },

    setKeyAndToken(newKey, newToken) {
      key = newKey;
      token = newToken;
    },

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

    ...(
      apiCommonMethods.reduce((
        acc,
        [
          methodName,
          endpointUrl,
          method = 'GET',
          baseUrl,
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
            baseUrl: baseUrl || baseApiUrl,
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
