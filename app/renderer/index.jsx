import React from 'react';
import {
  render as reactRender,
} from 'react-dom';
import {
  Provider,
} from 'react-redux';
import * as Sentry from '@sentry/electron';
import {
  ipcRenderer,
} from 'electron';

import App from './containers/App';
import store from './store';

import './assets/stylesheets/main.less';
import pjson from '../package.json';

require('smoothscroll-polyfill').polyfill();

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    release: `${pjson.version}_${process.platform}`,
    enableNative: false,
    beforeSend(event, hint) {
      if (
        event?.message?.startsWith('Non-Error exception captured')
        && hint.originalException.error
        && hint.originalException.extra
      ) {
        Sentry.withScope((scope) => {
          scope.setExtra('nonErrorException', true);
          Sentry.captureException(
            hint.originalException.error,
            {
              extra: hint.originalException.extra,
            },
          );
        });
        return null;
      }
      return event;
    },
  });
}

window.onerror = (...argw) => {
  ipcRenderer.send('errorInWindow', argw);
};

const render = Component => (
  reactRender(
    <Provider store={store}>
      <Component />
    </Provider>,
    document.getElementById('root'),
  )
);

render(App);
