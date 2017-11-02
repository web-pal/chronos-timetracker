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
  return assigneeId === 'unassigned' ? 'assignee is EMPTY' : 'assignee = currentUser()';
}

function mapSearchValue(searchValue, projectKey) {
  if (searchValue.startsWith(`${projectKey}-`)) {
    return `key = "${searchValue}"`;
  }
  if (/^[0-9]*$/.test(searchValue)) {
    return `(key = "${projectKey}-${searchValue}" OR summary ~ "${searchValue}")`;
  }
  return `summary ~ "${searchValue}"`;
}

export function getIssueTransitions(issueId) {
  return jira.client.issue.getTransitions({ issueId });
}

export function transitionIssue(issueId, transitionId) {
  return jira.client.issue.transitionIssue({
    issueId,
    transition: transitionId,
  });
}

export function fetchEpics() {
  const jql = "issuetype = 'Epic'";
  return jira.client.search.search({ jql, maxResults: 1000, startAt: 0 });
}

export function fetchIssues({
  startIndex,
  stopIndex,
  projectId,
  projectType,
  sprintId,
  searchValue,
  projectKey,
  filters,
  epicLinkFieldId,
}) {
  const typeFilters = filters.type;
  const statusFilters = filters.status;
  const assigneeFilter = filters.assignee[0];
  const jql = [
    (projectType === 'project' ? `project = ${projectId}` : ''),
    ((projectType === 'scrum') && sprintId ? `sprint = ${sprintId}` : ''),
    (searchValue ? mapSearchValue(searchValue, projectKey) : ''),
    (typeFilters.length ? `issueType in (${typeFilters.join(',')})` : ''),
    (statusFilters.length ? `status in (${statusFilters.join(',')})` : ''),
    (assigneeFilter ? mapAssignee(assigneeFilter) : ''),
  ].filter(f => !!f).join(' AND ');
  const api = projectType === 'project'
    ? opts => jira.client.search.search(opts)
    : opts => jira.client.board.getIssuesForBoard({ ...opts, boardId: projectId });
  let _requiredFields = requiredFields;
  if (epicLinkFieldId) {
    _requiredFields = [...requiredFields, epicLinkFieldId];
  }
  return api({
    jql,
    maxResults: (stopIndex - startIndex) + 1,
    startAt: startIndex,
    fields: _requiredFields,
  });
}

export function fetchIssue(issueId) {
  return jira.client.issue.getIssue({
    issueId,
    fields: requiredFields,
  });
}


export function fetchRecentIssues({
  projectId,
  projectType,
  sprintId,
  worklogAuthor,
}) {
  const jql = [
    (projectType === 'project' ? `project = ${projectId}` : ''),
    ((projectType === 'scrum') && sprintId ? `sprint = ${sprintId}` : ''),
    `worklogAuthor = ${worklogAuthor} `,
    'timespent > 0 AND worklogDate >= "-4w"',
  ].filter(f => !!f).join(' AND ');

  const api = projectType === 'project'
    ? opts => jira.client.search.search(opts)
    : opts => jira.client.board.getIssuesForBoard({ ...opts, boardId: projectId });

  return api({
    jql,
    maxResults: 1000,
    fields: requiredFields,
  });
}

export function fetchSearchIssues({
  projectId,
  projectType,
  sprintId,
  projectKey,
  searchValue,
}) {
  return new Promise((resolve) => {
    const promises = [];
    const searchValueWithKey = (projectType === 'project') && (/^\d+$/.test(searchValue))
      ? `${projectKey}-${searchValue}`
      : searchValue;

    const api = projectType === 'project'
      ? (opts, callback) => jira.client.search.search(opts, callback)
      : (opts, callback) => jira.client.board.getIssuesForBoard(
        { ...opts, boardId: projectId },
        callback,
      );

    const project = projectType === 'project' ? `project = ${projectId}` : '';
    const sprint = (projectType === 'scrum') && sprintId ? `sprint = ${sprintId}` : '';

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

export function assignIssue(opts) {
  return jira.client.issue.assignIssue(opts);
}

export function fetchIssueFields() {
  return jira.client.field.getAllFields();
}
