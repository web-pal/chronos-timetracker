// @flow
import moment from 'moment';
import { ipcRenderer } from 'electron';
import 'moment-duration-format';

import type { Worklog } from '../../../types';

// convert JIRA time (e.g 1d 1h 20m) to seconds
export function jts(jiraTimeString: string): number {
  const jiraTimeArray: Array<string> = jiraTimeString.split(' ');
  let resultSeconds: number = 0;
  jiraTimeArray.forEach((unit: string) => {
    const value: number = Number(unit.slice(0, -1));
    const postfix: string = unit[unit.length - 1];
    switch (postfix) {
      case 'd':
        resultSeconds += value * 86400;
        break;
      case 'h':
        resultSeconds += value * 3600;
        break;
      case 'm':
        resultSeconds += value * 60;
        break;
      case 's':
        resultSeconds += value;
        break;
      default:
        break;
    }
  });
  return resultSeconds;
}

export function stj(seconds: number, format?: string = 'h[h] m[m]'): string {
  // $FlowFixMe
  return moment.duration(seconds * 1000).format(format);
}

export function setLoggedTodayOnTray(allWorklogs: Array<Worklog>, selfKey: string): void {
  const today = new Date();
  const loggedToday = allWorklogs
    .filter(w => w.author.key === selfKey)
    .filter(w => moment(w.created).isSame(today, 'day'))
    .reduce((prevValue, i) => i.timeSpentSeconds + prevValue, 0);
  const humanFormat = new Date(loggedToday * 1000).toISOString().substr(11, 8);
  ipcRenderer.send('set-logged-today', humanFormat);
}
