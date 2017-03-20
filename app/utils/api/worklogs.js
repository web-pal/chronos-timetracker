import jira from '../jiraClient';

export function fetchWorklogs(issues) {
  return new Promise((resolve) => {
    const promises = issues.map(issue => (
      new Promise((r) => {
        jira.client.issue.getWorkLogs({
          issueId: issue.id,
        }, (err, response) => {
          r(response ? response.worklogs : []);
        });
      })
    ));
    Promise.all(promises).then((results) => {
      const items = [].concat(...results.map(i => i));
      resolve(items);
    });
  });
}
