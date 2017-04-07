import jira from '../jiraClient';

const requiredFields = [
  'issuetype',
  'labels',
  'priority',
  'status',
  'resolution',
  'summary',
  'reporter',
  'assignee',
  'description',
  'worklog',
  'timeestimate',
  'timespent',
];


export function fetchIssues({
  startIndex,
  stopIndex,
  currentProject,
  typeFiltresId = [],
  statusFiltresId = [],
  assigneeFiltresFields = [],
}) {
  const jql = [
    `project = ${currentProject}`,
    (typeFiltresId.length ? ` AND issueType in (${typeFiltresId.join(',')})` : ''),
    (statusFiltresId.length ? ` AND status in (${statusFiltresId.join(',')})` : ''),
    (assigneeFiltresFields.length ? ` AND (${assigneeFiltresFields.join(' OR ')})` : ''),
  ].join('');
  return jira.client.search.search({
    jql,
    maxResults: stopIndex - startIndex,
    startAt: startIndex,
    fields: requiredFields,
  });
}

export function fetchIssue(issueId) {
  return jira.client.issue.getIssue({
    issueId,
    fields: requiredFields,
  });
}


export function fetchRecentIssues({ currentProject, worklogAuthor }) {
  return jira.client.search.search({
    jql: [
      `project = ${currentProject} `,
      `AND worklogAuthor = ${worklogAuthor} `,
      'AND timespent > 0 AND worklogDate >= "-4w"',
    ].join(''),
    maxResults: 1000,
    fields: requiredFields,
  });
}

export function fetchSearchIssues({ currentProject, projectKey, searchValue }) {
  return new Promise((resolve) => {
    const promises = [];
    const searchValueWithKey = /^\d+$/.test(searchValue) ? `${projectKey}-${searchValue}` : searchValue;
    promises.push(new Promise((r) => {
      jira.client.search.search({
        jql: `project = ${currentProject} AND issuekey = "${searchValueWithKey}"`,
        maxResults: 1000,
        fields: requiredFields,
      }, (error, response) => r(response ? response.issues : []));
    }));
    promises.push(new Promise((r) => {
      jira.client.search.search({
        jql: `project = ${currentProject} AND summary ~ "${searchValue}"`,
        maxResults: 1000,
        fields: requiredFields,
      }, (error, response) => r(response ? response.issues : []));
    }));
    Promise.all(promises).then((results) => {
      const items = [].concat(...results.map(i => i));
      resolve(items);
    });
  });
}
