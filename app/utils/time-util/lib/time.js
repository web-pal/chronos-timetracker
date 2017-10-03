import moment from 'moment';

require('moment-duration-format');

export function jts(jiraTimeString) { // convert JIRA time (e.g 1d 1h 20m) to seconds
  const jiraTimeArray = jiraTimeString.split(' ');
  let resultSeconds = 0;
  jiraTimeArray.forEach((unit) => {
    const value = Number(unit.slice(0, -1));
    const postfix = unit[unit.length - 1];
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

export function stj(seconds, format) {
  return moment.duration(seconds * 1000).format(format);
}

export function setLoggedTodayOnTray(allWorklogs, selfKey) {
  const today = new Date();
  const loggedToday = allWorklogs
    .filter(w => w.getIn(['author', 'key']) === selfKey)
    .filter(w => moment(w.get('created')).isSame(today, 'day'))
    .reduce((prevValue, i) => i.get('timeSpentSeconds') + prevValue, 0);
  const humanFormat = new Date(loggedToday * 1000).toISOString().substr(11, 8);
  ipcRenderer.send('setLoggedToday', humanFormat);
}
