// @flow
import {
  eventChannel,
} from 'redux-saga';
import {
  ipcRenderer,
} from 'electron';
import EventEmitter from 'events';

type Handler = {
  (ev: Event): void;
};


export default function createIpcChannel(
  channel: string,
  listener: EventEmitter | any = ipcRenderer,
) {
  return eventChannel((emit) => {
    const handler: Handler = (ev, ...payload) => {
      emit({ ev, channel, payload });
    };
    listener.on(channel, handler);
    // eventChannel must return unsubcribe function
    return () => {
      ipcRenderer.removeListener(channel, handler);
    };
  });
}
