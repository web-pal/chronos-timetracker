// @flow
import React from 'react';
import {
  render,
} from 'react-dom';
import * as Sentry from '@sentry/electron';

import IdlePopup from './containers/Popups/IdlePopup';
import pjson from '../package.json';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    enableNative: false,
    release: `${pjson.version}_${process.platform}`,
  });
}

render(
  <IdlePopup />,
  document.getElementById('root'),
);
