function apiFactory({ makeRequest }) {
  const apiCommonMethods = [
    ['getMyself', '/myself'],
    ['getMyPermissions', '/mypermissions'],
    ['searchForFilters', '/filter/search'],
    ['getAllFilters', '/filter'],
    ['getFavouriteFilters', '/filter/favourite'],
    ['getFilterById', '/filter/{filterId}'],
    ['createFilter', '/filter', 'POST'],
    ['updateFilter', '/filter/{filterId}', 'PUT'],
    ['searchForMentionUsers', '/user/mention/search', 'GET', '/rest/internal/2'],
    ['searchForUsers', '/groupuserpicker'],
    ['searchForIssues', '/search'],
    ['getIssueByIdOrKey', '/issue/{issueIdOrKey}'],
    ['getIssueWorklogs', '/issue/{issueIdOrKey}/worklog'],
    ['getIssueTransitions', '/issue/{issueIdOrKey}/transitions'],
    ['getIssueComments', '/issue/{issueIdOrKey}/comment'],
    ['addIssueComment', '/issue/{issueIdOrKey}/comment', 'POST'],
    ['transitionIssue', '/issue/{issueIdOrKey}/transitions', 'POST'],
    ['assignIssue', '/issue/{issueIdOrKey}/assignee', 'PUT'],
    ['deleteIssueWorklog', '/issue/{issueIdOrKey}/worklog/{worklogId}', 'DELETE'],
    ['addIssueWorklog', '/issue/{issueIdOrKey}/worklog/', 'POST'],
    ['updateIssueWorklog', '/issue/{issueIdOrKey}/worklog/{worklogId}', 'PUT'],
    ['getCreateIssueMetadata', '/issue/createmeta'],
    ['searchForProjects', '/project/search'],
    ['getAllProjects', '/project'],
    ['getProjectByIdOrKey', '/project/{projectIdOrKey}'],
    ['getProjectVersions', '/project/{projectIdOrKey}/version'],
    ['getProjectComponents', '/project/{projectIdOrKey}/component'],
    ['getProjectStatuses', '/project/{projectIdOrKey}/statuses'],
    ['getComponentById', '/component/{id}'],
    ['getVersionById', '/version/{id}'],
    ['getAllIssueTypesForUser', '/issuetype'],
    ['getAllIssueFields', '/field'],
    ['getUserByAccountId', '/user'],
    ['getAllIssueStatuses', '/status'],
    ['getAllBoards', '/board', 'GET', '/rest/agile/1.0'],
    ['getBoardById', '/board/{boardId}', 'GET', '/rest/agile/1.0'],
    ['getBoardProjects', '/board/{boardId}/project', 'GET', '/rest/agile/1.0'],
    ['getBoardSprints', '/board/{boardId}/sprint', 'GET', '/rest/agile/1.0'],
    ['getSprintById', '/sprint/{sprintId}', 'GET', '/rest/agile/1.0'],
    ['saveWorklogActivity', '/worklogActivity', 'POST', '/plugins/servlet/chronos'],
    ['getWorklogActivity', '/worklogActivity', 'GET', '/plugins/servlet/chronos'],
    ['deleteScreenshot', '/deleteScreenshot', 'POST', '/plugins/servlet/chronos'],
  ];

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  let rootApiUrl = '';
  let baseApiUrl = '/rest/api/2';
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

    urlInstance.search = new URLSearchParams(params);
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
      `${rootApiUrl}${baseUrl}`,
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

    setBaseUrl(newBaseUrl, newRootUrl) {
      baseApiUrl = newBaseUrl;
      if (newRootUrl) {
        rootApiUrl = newRootUrl;
      }
      return baseApiUrl;
    },

    setRootUrl(url) {
      rootApiUrl = url;
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

    uploadScreenshotOnSelfServer({
      image,
      filename,
    }) {
      const formData = new FormData();
      formData.append(
        'file',
        new File([image], filename),
      );
      return makeRequest(
        `${rootApiUrl}/plugins/servlet/chronos/screenshots`,
        {
          method: 'POST',
          body: formData,
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
