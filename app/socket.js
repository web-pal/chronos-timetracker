import io from 'socket.io-client';
import storage from 'electron-json-storage';
import config from 'config';

import * as types from './constants';
import store from './store';

export default class Socket {
  static connect() {
    this.socket = io(config.socketUrl, {
      reconnection: true,
      reconnectionDelay: 200,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 99999,
    });
  }

  static login() {
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
      store.dispatch({
        type: types.FILL_SETTINGS,
        payload: response.newSetting.desktopApp,
      });
    });

    this.socket.on('showCurrentWorklog', ({ toSocketId }) => {
      const state = store.getState();

      const running = state.timer.running;
      const tempId = state.worklogs.meta.temporaryWorklogId;
      const issueId = state.issues.meta.trackingIssueId;
      const timeSpentSeconds = state.timer.time;
      const description = state.worklogs.meta.currentDescription;
      const screenshots =
        state.worklogs.meta.currentWorklogScreenshots.toArray().map(s => ({ ...s }));
      const userData = state.profile.userData;
      const currentProjectId = state.issues.byId.getIn([issueId, 'fields', 'project', 'id']);
      const worklogData = {
        id: tempId,
        issueId,
        timeSpentSeconds,
        description,
        screenshots,
        currentProjectId,
        toSocketId,
        user: userData.toJS(),
      };
      const currentBoardId = state.projects.meta.selectedProjectId;
      if (currentBoardId !== currentProjectId) {
        worklogData.currentBoardId = currentBoardId;
      }

      if (running) {
        this.socket.emit(
          'sendCurrentWorklog',
          { ...worklogData },
        );
      }
    });
  }
}
