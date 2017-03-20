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


export function fetchIssues({ startIndex, stopIndex, currentProject }) {
  return jira.client.search.search({
    jql: `project = ${currentProject}`,
    maxResults: stopIndex - (startIndex + 1),
    startAt: startIndex,
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
