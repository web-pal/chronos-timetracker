/* eslint-disable no-param-reassign */
import {
  actionTypes,
} from 'actions';

import configureStore from './store/configurePreloadStore';

/* Do not run sentry here, it will confilct with atlassian sentry
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    enableNative: false,
    release: `${pjson.version}_${process.platform}`,
  });
}
*/

const store = configureStore();

function setRendererUiState(
  keyOrRootValues,
  maybeValues,
) {
  return {
    type: actionTypes.SET_UI_STATE,
    payload: {
      keyOrRootValues,
      maybeValues,
    },
    scope: 1,
  };
}

function hideNode(el, scope) {
  const node = (scope || document).querySelector(el);
  if (node) {
    node.style.display = 'none';
  }
}

function back(error = null) {
  store.dispatch(setRendererUiState({
    authFormStep: 1,
    authFormIsComplete: false,
    authError: error,
  }));
}

function initAtlassian(base, reset) {
  base.style.width = '100%';
  base.style.height = '100%';

  hideNode('header', base);
  hideNode('footer', base);

  // focus email input
  const input = document.getElementById('username');
  if (input) {
    input.focus();
  }

  if (reset) {
    reset.innerHTML = 'Back';
    reset.addEventListener('click', (ev) => {
      ev.stopPropagation();
      ev.preventDefault();
      back();
    });
  }
  store.dispatch(setRendererUiState({
    authFormIsComplete: true,
  }));
}

function initGoogle(base) {
  hideNode('header');
  hideNode('footer');

  const a = document.createElement('a');
  a.innerHTML = 'Back to Jira';
  base.insertAdjacentElement('afterend', a);
  a.addEventListener('click', (ev) => {
    ev.preventDefault();
    back();
  });
  store.dispatch(setRendererUiState({
    authFormIsComplete: true,
  }));
}

function init2F(base) {
  hideNode('header', base);
  hideNode('footer', base);

  store.dispatch(setRendererUiState({
    authFormIsComplete: true,
  }));
}

function init() {
  store.dispatch(setRendererUiState({
    authFormIsComplete: false,
  }));
  if (
    global.location.host === 'id.atlassian.com'
    && global.location.pathname === '/login'
  ) {
    const base = document.getElementById('root');
    const reset = document.getElementById('resetPassword');
    if (base) {
      initAtlassian(base, reset);
    }
  } else if (global.location.host === 'accounts.google.com') {
    const base = document.getElementById('view_container');
    if (base) {
      initGoogle(base);
    }
  } else if (global.location.host === 'auth.atlassian.com') {
    const base = document.getElementById('root');
    if (base) {
      init2F(base);
    }
  } else if (global.location.pathname === '/login') {
    back('Something has gone wrong');
  } else {
    store.dispatch(setRendererUiState({
      authFormIsComplete: true,
    }));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  init();
});
