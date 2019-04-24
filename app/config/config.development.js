const config = {
  // apiUrl: 'http://127.0.0.1:5000/api', // server url
  apiUrl: 'https://chronos-api.web-pal.com/api', // server url
  socketUrl: 'https://chronos-socket.web-pal.com', // url of socket server

  supportLink: 'https://web-pal.atlassian.net/servicedesk/customer/portal/2',
  githubLink: 'https://github.com/web-pal/chronos-timetracker',

  idleTimeThreshold: 300, // seconds of inactivity considering user is idle
  checkUpdates: false,
  infoLog: false,
  reduxLogger: true,
  issueWindowDevTools: false,
  idleWindowDevTools: false,
  loginWindowDevTools: false,
  attachmentsWindowDevtools: false,
  screenshotNotificationWindowDevtools: false,
  screenshotsViewerWindowDevtools: false,
};

export default config;
