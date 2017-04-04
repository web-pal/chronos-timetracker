const config = {
  staticUrl: 'https://chronos-api.web-pal.com', // static server url
  apiUrl: 'http://127.0.0.1:5000', // server url
  socketUrl: 'https://chronos-socket.web-pal.com', // url of socket server
  idleTimeThreshold: 300, // seconds of inactivity considering user is idle
  useSentry: false,
};

export default config;
