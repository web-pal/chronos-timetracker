const config = {
  staticUrl: 'https://chronos-api.web-pal.com', // static server url
  apiUrl: 'https://chronos-api.web-pal.com', // server url
  socketUrl: 'https://chronos-socket.web-pal.com', // url of socket server
  // idleTimeThreshold: 60 * 60 * 24, // seconds of inactivity considering user is idle
  idleTimeThreshold: 300,
  checkUpdates: true,
};

export default config;
