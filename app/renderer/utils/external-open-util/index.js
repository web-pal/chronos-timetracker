// @flow
import {
  shell,
} from 'electron';
import type {
  Issue,
  Project,
  Worklog,
} from 'types';

export function openIssueInBrowser(issue: Issue): { (ev: SyntheticMouseEvent<any>): void } {
  return (ev: SyntheticMouseEvent<any>) => {
    ev.preventDefault();
    const urlArr = issue.self.split('/');
    shell.openExternal(`${urlArr[0]}//${urlArr[2]}/browse/${issue.key}`);
  };
}

export function openProjectInBrowser(project: Project): { (ev: SyntheticMouseEvent<any>): void } {
  return (ev: SyntheticMouseEvent<any>) => {
    ev.preventDefault();
    const urlArr: Array<string> = project.self.split('/');
    shell.openExternal(`${urlArr[0]}//${urlArr[2]}/projects/${project.key}`);
  };
}

export function openWorklogInBrowser(
  worklog: Worklog,
  issueKey: string,
): { (ev: SyntheticMouseEvent<any>): void } {
  return (ev: SyntheticMouseEvent<any>) => {
    ev.preventDefault();
    const urlArr: Array<string> = worklog.self.split('/');
    const urlQuery =
      `focusedWorklogId=${worklog.id}&page=com.atlassian.jira.plugin.system.issuetabpanels%3Aworklog-tabpanel#worklog-${worklog.id}`;
    shell.openExternal(`${urlArr[0]}//${urlArr[2]}/browse/${issueKey}?${urlQuery}`);
  };
}

export function openURLInBrowser(url: string): { (ev: SyntheticMouseEvent<any>): void } {
  return (ev: SyntheticMouseEvent<any>) => {
    ev.preventDefault();
    shell.openExternal(url);
  };
}
