// @flow
import { shell } from 'electron';
import type { Issue, Project } from '../../types';

export function openIssueInBrowser(issue: Issue): { (ev: SyntheticMouseEvent<any>): void } {
  return (ev: SyntheticMouseEvent<any>) => {
    ev.preventDefault();
    const urlArr: string = issue.self.split('/');
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

export function openURLInBrowser(url: string): { (ev: SyntheticMouseEvent<any>): void } {
  return (ev: SyntheticMouseEvent<any>) => {
    ev.preventDefault();
    shell.openExternal(url);
  };
}
