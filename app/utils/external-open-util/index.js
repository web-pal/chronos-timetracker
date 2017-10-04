import { shell } from 'electron';

export function openIssueInBrowser(issue) {
  return (ev) => {
    ev.preventDefault();
    const urlArr = issue.self.split('/');
    shell.openExternal(`${urlArr[0]}//${urlArr[2]}/browse/${issue.key}`);
  };
}

export function openProjectInBrowser(project) {
  return (ev) => {
    ev.preventDefault();
    const urlArr = project.self.split('/');
    shell.openExternal(`${urlArr[0]}//${urlArr[2]}/projects/${project.key}`);
  };
}
