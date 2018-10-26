// @flow
import {
  shell,
} from 'electron';
import type {
  Worklog,
} from 'types';

export function openWorklogInBrowser(
  worklogId: Worklog,
  issueKey: string,
  baseUrl: string,
): { (ev: SyntheticMouseEvent<any>): void } {
  return (ev: SyntheticMouseEvent<any>) => {
    ev.preventDefault();
    const urlQuery = `focusedWorklogId=${worklogId}&page=com.atlassian.jira.plugin.system.issuetabpanels%3Aworklog-tabpanel#worklog-${worklogId}`;
    shell.openExternal(`${baseUrl}/browse/${issueKey}?${urlQuery}`);
  };
}

export function openURLInBrowser(url: string): { (ev: SyntheticMouseEvent<any>): void } {
  return (ev: SyntheticMouseEvent<any>) => {
    ev.preventDefault();
    shell.openExternal(url);
  };
}
