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

function mapAssignee(assigneeId) {
  switch (assigneeId) {
    case 'none':
      return 'assignee is EMPTY';
    case 'currentUser':
      return 'assignee = currentUser()';
    default:
      return '';
  }
}

export function fetchIssues({
  startIndex,
  stopIndex,
  currentProjectId, currentProjectType,
  typeFiltresId = [],
  statusFiltresId = [],
  assigneeFiltresId = [],
}) {
  const assigneeFiltresFields = assigneeFiltresId.map(mapAssignee);
  const jql = [
    (currentProjectType === 'project' ? `project = ${currentProjectId}` : 'project = 10100'),
    (typeFiltresId.length ? ` AND issueType in (${typeFiltresId.join(',')})` : ''),
    (statusFiltresId.length ? ` AND status in (${statusFiltresId.join(',')})` : ''),
    (assigneeFiltresFields.length ? ` AND (${assigneeFiltresFields.join(' OR ')})` : ''),
  ].join('');
  console.log('fetchIssues jql', jql);
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


export function fetchRecentIssues({ currentProjectId, currentProjectType, worklogAuthor }) {
  return jira.client.search.search({
    jql: [
      (currentProjectType === 'project' ? `project = ${currentProjectId}` : 'project = 10100'),
      `worklogAuthor = ${worklogAuthor} `,
      'timespent > 0 AND worklogDate >= "-4w"',
    ].join(' AND '),
    maxResults: 1000,
    fields: requiredFields,
  });
}

export function fetchSearchIssues({
  currentProjectId,
  currentProjectType,
  projectKey,
  searchValue,
}) {
  return new Promise((resolve) => {
    const promises = [];
    const searchValueWithKey = (currentProjectType === 'project') && (/^\d+$/.test(searchValue))
      ? `${projectKey}-${searchValue}`
      : searchValue;
    promises.push(new Promise((r) => {
      jira.client.search.search({
        jql: [
          (currentProjectType === 'project' ? `project = ${currentProjectId}` : 'project = 10100'),
          `issuekey = "${searchValueWithKey}"`,
        ].join(' AND '),
        maxResults: 1000,
        fields: requiredFields,
      }, (error, response) => r(response ? response.issues : []));
    }));
    promises.push(new Promise((r) => {
      jira.client.search.search({
        jql: [
          (currentProjectType === 'project' ? `project = ${currentProjectId}` : 'project = 10100'),
          `summary ~ "${searchValue}"`,
        ].join(' AND '),
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
