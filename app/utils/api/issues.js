import jira from '../jiraClient';

const requiredFields = [
  'issuetype',
  'project',
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
  'fixVersions',
  'versions',
  'components',
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

export function fetchFields() {

}

export function fetchIssues({
  startIndex,
  stopIndex,
  currentProjectId, currentProjectType,
  currentSprintId,
  typeFiltresId = [],
  statusFiltresId = [],
  assigneeFiltresId = [],
}) {
  const assigneeFiltresFields = assigneeFiltresId.map(mapAssignee);
  const jql = [
    (currentProjectType === 'project' ? `project = ${currentProjectId}` : ''),
    ((currentProjectType === 'scrum') && currentSprintId ? `sprint = ${currentSprintId}` : ''),
    (typeFiltresId.length ? `issueType in (${typeFiltresId.join(',')})` : ''),
    (statusFiltresId.length ? `status in (${statusFiltresId.join(',')})` : ''),
    (assigneeFiltresFields.length ? `(${assigneeFiltresFields.join(' OR ')})` : ''),
  ].filter(f => !!f).join(' AND ');
  const api = currentProjectType === 'project'
    ? opts => jira.client.search.search(opts)
    : opts => jira.client.board.getIssuesForBoard({ ...opts, boardId: currentProjectId });
  return api({
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


export function fetchRecentIssues({
  currentProjectId,
  currentProjectType,
  currentSprintId,
  worklogAuthor,
}) {
  const jql = [
    (currentProjectType === 'project' ? `project = ${currentProjectId}` : ''),
    ((currentProjectType === 'scrum') && currentSprintId ? `sprint = ${currentSprintId}` : ''),
    `worklogAuthor = ${worklogAuthor} `,
    'timespent > 0 AND worklogDate >= "-4w"',
  ].filter(f => !!f).join(' AND ');

  const api = currentProjectType === 'project'
    ? opts => jira.client.search.search(opts)
    : opts => jira.client.board.getIssuesForBoard({ ...opts, boardId: currentProjectId });

  return api({
    jql,
    maxResults: 1000,
    fields: requiredFields,
  });
}

export function fetchSearchIssues({
  currentProjectId,
  currentProjectType,
  currentSprintId,
  projectKey,
  searchValue,
}) {
  return new Promise((resolve) => {
    const promises = [];
    const searchValueWithKey = (currentProjectType === 'project') && (/^\d+$/.test(searchValue))
      ? `${projectKey}-${searchValue}`
      : searchValue;

    const api = currentProjectType === 'project'
      ? (opts, callback) => jira.client.search.search(opts, callback)
      : (opts, callback) => jira.client.board.getIssuesForBoard(
        { ...opts, boardId: currentProjectId },
      callback,
    );

    const project = currentProjectType === 'project' ? `project = ${currentProjectId}` : '';
    const sprint = (currentProjectType === 'scrum') && currentSprintId ? `sprint = ${currentSprintId}` : '';

    promises.push(new Promise((r) => {
      api({
        jql: [
          project,
          sprint,
          `issuekey = "${searchValueWithKey}"`,
        ].filter(f => !!f).join(' AND '),
        maxResults: 1000,
        fields: requiredFields,
      }, (error, response) => r(response ? response.issues : []));
    }));

    promises.push(new Promise((r) => {
      api({
        jql: [
          project,
          sprint,
          `summary ~ "${searchValue}"`,
        ].filter(f => !!f).join(' AND '),
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
