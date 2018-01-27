import Raven from 'raven-js';

import {
  infoLog,
} from 'config';


export function sendInfoLog(message, extra = {}) {
  if (infoLog) {
    Raven.captureMessage(message, {
      level: 'info',
      extra,
    });
  }
}
