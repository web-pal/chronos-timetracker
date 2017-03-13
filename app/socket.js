import io from 'socket.io-client';
import storage from 'electron-json-storage';
import config from 'config';

import * as types from './constants';

export default class Socket {
  static connect() {
    this.socket = io(config.socketUrl, {
      reconnection: true,
      reconnectionDelay: 200,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 99999,
    });
  }

  static login(dispatch, getState) {
    this.dispatch = dispatch;
    this.getState = getState;
    this.connect();
    console.log('Socket login');

    this.socket.on('connect', () => {
      setTimeout(() => {
        storage.get('desktop_tracker_jwt', (error, jwt) => {
          this.socket.emit('login', { jwt });
        });
      }, 2000);
    });

    this.socket.on('new settings', (response) => {
      console.log('new settings', response);
      dispatch({
        type: types.FILL_SETTINGS,
        payload: response.newSetting.desktopApp,
      });
    });
  }
}
