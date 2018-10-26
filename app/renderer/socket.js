import io from 'socket.io-client';
import storage from 'electron-json-storage';
import config from 'config';
import { settingsActions } from 'actions';

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
      // store.dispatch(settingsActions.fillSettings(response.newSetting.desktopApp));
    });

    this.socket.on('showCurrentWorklog', () => {
      console.log('showCurrentWorklog');
      /*
 *       const state = store.getState();
 *       const screenshots =
 *         state.worklogs.meta.currentWorklogScreenshots.toArray().map(s => ({ ...s }));
 *       const issueId = state.issues.meta.trackingIssueId;
 *       const currentProjectId = state.issues.byId.getIn([issueId, 'fields', 'project', 'id']);
 *       const host = state.profile.host;
 *
 *       const running = state.timer.running;
 *       const userData = state.profile.userData;
 *
 *       const author = userData.toJS();
 *       const comment = state.worklogs.meta.currentDescription;
 *       const tempId = state.worklogs.meta.temporaryWorklogId;
 *       const issue = state.issues.byId.get(issueId);
 *       const self = `https://${host}/rest/api/2/issue/${issueId}/worklog/${tempId}`;
 *       const timeSpentSeconds = state.timer.time;
 *       const timeSpent = stj(timeSpentSeconds, 'h[h] m[m]');
 *       const updateAuthor = author;
 *
 *       const updated = moment();
 *       const started = moment(updated).subtract(timeSpentSeconds, 's');
 *       const created = started;
 *
 *
 *       const payload = {
 *         worklog: {
 *           author,
 *           comment,
 *           created: created.format(),
 *           id: tempId,
 *           issue,
 *           issueId,
 *           self,
 *           started: started.format(),
 *           timeSpent,
 *           timeSpentSeconds,
 *           updateAuthor,
 *           updated,
 *           screenshots,
 *         },
 *         meta: {
 *           currentProjectId,
 *           toSocketId,
 *         },
 *       };
 *
 *       const currentBoardId = state.projects.meta.selectedProjectId;
 *       if (currentBoardId !== currentProjectId) {
 *         payload.meta.currentBoardId = currentBoardId;
 *       }
 *
 *       if (running) {
 *         this.socket.emit(
 *           'sendCurrentWorklog',
 *           payload,
 *         );
 *       }
 */
    });
  }
}
