const config = {
  apiUrl: 'http://127.0.0.1:5000', // server url
  socketUrl: 'https://chronos-socket.web-pal.com', // url of socket server

  supportLink: 'https://web-pal.atlassian.net/servicedesk/customer/portal/2',
  githubLink: 'https://github.com/web-pal/chronos-timetracker',

  idleTimeThreshold: 300, // seconds of inactivity considering user is idle
  checkUpdates: false,
  infoLog: false,
};

export default config;
