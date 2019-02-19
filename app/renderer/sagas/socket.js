import * as eff from 'redux-saga/effects';
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
    const payload = yield eff.take(connectChannel);
    yield eff.call(infoLog, 'socket connected', payload);
    const jwt = yield eff.call(getFromStorage, 'desktop_tracker_jwt');
    yield eff.call([socket, 'emit'], 'login', { jwt });
  }
}

export function* watchConnectErrorChannel() {
  while (true) {
    const { ev } = yield eff.take(connectErrorChannel);
    yield eff.call(throwError, ev);
  }
}

export function* watchErrorChannel() {
  while (true) {
    const { ev } = yield eff.take(errorChannel);
    yield eff.call(throwError, ev);
  }
}

export function* watchSettingsChannel() {
  while (true) {
    const payload = yield eff.take(settingsChannel);
    yield eff.call(infoLog, 'socket new-settings', payload);
  }
}

export function* watchShowWorklogChannel(socket) {
  while (true) {
    const { ev, payload } = yield eff.take(showWorklogChannel);
    yield eff.call(infoLog, 'socket showWorklog', payload, ev);
    const timerRunning = yield eff.select(getTimerRunning);
    if (timerRunning) {
      const tempId = yield eff.select(getTemporaryWorklogId);
      const host = yield eff.select(getHost);

      const screenshots = yield eff.select(getScreenshots);
      const author = yield eff.select(getUserData);
      const comment = yield eff.select(getWorklogComment);
      const timeSpentSeconds = yield eff.select(getTimerState('time'));
      const timeSpent = yield eff.call(stj, timeSpentSeconds);
      const issue = yield eff.select(getTrackingIssue);
      const issueId = issue.id;
      const self = `https://${host.hostname}/rest/api/2/issue/${issueId}/worklog/${tempId}`;
      const updateAuthor = author;
      const currentProjectId = yield eff.select(getSelectedProjectId);

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
      yield eff.call([socket, 'emit'], 'sendCurrentWorklog', socketPayload);
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

    const socket = yield eff.call(io, config.socketUrl, options);
    yield eff.call(infoLog, 'socket plugged', socket);

    connectErrorChannel = yield eff.call(createIOChannel, 'connect_error', socket);
    yield eff.fork(watchConnectErrorChannel);

    errorChannel = yield eff.call(createIOChannel, 'error', socket);
    yield eff.fork(watchErrorChannel);

    connectChannel = yield eff.call(createIOChannel, 'connect', socket);
    yield eff.fork(watchConnectChannel, socket);

    settingsChannel = yield eff.call(createIOChannel, 'new-settings', socket);
    yield eff.fork(watchSettingsChannel);

    showWorklogChannel = yield eff.call(createIOChannel, 'showCurrentWorklog', socket);
    yield eff.fork(watchShowWorklogChannel, socket);
  } catch (err) {
    Raven.captureException(err);
  }
}
