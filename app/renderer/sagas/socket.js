import { call, take, fork, select } from 'redux-saga/effects';
import moment from 'moment';
import { eventChannel } from 'redux-saga';
import io from 'socket.io-client';
import config from 'config';
import Raven from 'raven-js';
import {
  getScreenshots,
  getTimerRunning,
  getTemporaryWorklogId,
  getHost,
  getUserData,
  getWorklogComment,
  getTimerState,
  getTrackingIssue,
  getSelectedProjectId,
} from 'selectors';
import { stj } from 'utils/time-util';

import { infoLog, throwError } from './ui';

import { getFromStorage } from './storage';

type Handler = {
  (ev: Event): void;
};

export default function createIOChannel(
  channel: string,
  socket: EventEmitter,
) {
  return eventChannel((emit) => {
    const handler: Handler = (ev, ...payload) => {
      emit({ ev, channel, payload });
    };
    socket.on(channel, handler);
    // eventChannel must return unsubcribe function
    return () => {
      socket.removeListener(channel, handler);
    };
  });
}

let connectChannel;
let connectErrorChannel;
let errorChannel;
let settingsChannel;
let showWorklogChannel;

export function* watchConnectChannel(socket) {
  while (true) {
    const payload = yield take(connectChannel);
    yield call(infoLog, 'socket connected', payload);
    const jwt = yield call(getFromStorage, 'desktop_tracker_jwt');
    yield call([socket, 'emit'], 'login', { jwt });
  }
}

export function* watchConnectErrorChannel() {
  while (true) {
    const { ev } = yield take(connectErrorChannel);
    yield call(throwError, ev);
  }
}

export function* watchErrorChannel() {
  while (true) {
    const { ev } = yield take(errorChannel);
    yield call(throwError, ev);
  }
}

export function* watchSettingsChannel() {
  while (true) {
    const payload = yield take(settingsChannel);
    yield call(infoLog, 'socket new-settings', payload);
  }
}

export function* watchShowWorklogChannel(socket) {
  while (true) {
    const { ev, payload } = yield take(showWorklogChannel);
    yield call(infoLog, 'socket showWorklog', payload, ev);
    const timerRunning = yield select(getTimerRunning);
    if (timerRunning) {
      const tempId = yield select(getTemporaryWorklogId);
      const host = yield select(getHost);

      const screenshots = yield select(getScreenshots);
      const author = yield select(getUserData);
      const comment = yield select(getWorklogComment);
      const timeSpentSeconds = yield select(getTimerState('time'));
      const timeSpent = yield call(stj, timeSpentSeconds);
      const issue = yield select(getTrackingIssue);
      const issueId = issue.id;
      const self = `https://${host.hostname}/rest/api/2/issue/${issueId}/worklog/${tempId}`;
      const updateAuthor = author;
      const currentProjectId = yield select(getSelectedProjectId);

      const updated = moment();
      const started = moment(updated).subtract(timeSpentSeconds, 's');
      const created = started;

      const socketPayload = {
        worklog: {
          author,
          comment,
          created: created.format(),
          id: tempId,
          issue,
          issueId,
          self,
          started: started.format(),
          timeSpent,
          timeSpentSeconds,
          updateAuthor,
          updated,
          screenshots,
        },
        meta: {
          currentProjectId,
          toSocketId: ev.toSocketId,
        },
      };
      yield call([socket, 'emit'], 'sendCurrentWorklog', socketPayload);
    }
  }
}

export function* plugSocket() {
  try {
    const options = {
      reconnection: true,
      reconnectionDelay: 200,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 99999,
    };

    const socket = yield call(io, config.socketUrl, options);
    yield call(infoLog, 'socket plugged', socket);

    connectErrorChannel = yield call(createIOChannel, 'connect_error', socket);
    yield fork(watchConnectErrorChannel);

    errorChannel = yield call(createIOChannel, 'error', socket);
    yield fork(watchErrorChannel);

    connectChannel = yield call(createIOChannel, 'connect', socket);
    yield fork(watchConnectChannel, socket);

    settingsChannel = yield call(createIOChannel, 'new-settings', socket);
    yield fork(watchSettingsChannel);

    showWorklogChannel = yield call(createIOChannel, 'showCurrentWorklog', socket);
    yield fork(watchShowWorklogChannel, socket);
  } catch (err) {
    Raven.captureException(err);
  }
}
