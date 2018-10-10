/* eslint-disable no-param-reassign */
import {
  uiActions,
} from 'actions';

import configureStore from './store/configurePreloadStore';

const store = configureStore();

function hideNode(el, scope) {
  const node = (scope || document).querySelector(el);
  if (node) {
    node.style.display = 'none';
  }
}

function back() {
  store.dispatch(
    uiActions.setUiState('authFormStep', 1, 'allRenderer'),
  );
  store.dispatch(
    uiActions.setUiState('authFormIsComplete', false, 'allRenderer'),
  );
  store.dispatch(uiActions.setUiState('authError', null));
}

function initAtlassian(base) {
  base.style.width = '100%';
  base.style.height = '100%';
  base.style.overflow = 'hidden';

  hideNode('header', base);
  hideNode('footer', base);

  // focus email input
  const input = document.getElementById('username');
  if (input) {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('focus', true, false);
    input.dispatchEvent(event);
  }

  const reset = document.getElementById('resetPassword');
  if (reset) {
    reset.innerHTML = 'Back';
    reset.addEventListener('click', (ev) => {
      ev.stopPropagation();
      ev.preventDefault();
      back();
    });
  }
  store.dispatch(
    uiActions.setUiState('authFormIsComplete', true, 'allRenderer'),
  );
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
}

function init() {
  if (global.location.host === 'id.atlassian.com') {
    const base = document.getElementById('root');
    if (base) {
      initAtlassian(base);
    } else {
      setTimeout(init, 500);
    }
  }

  if (global.location.host === 'accounts.google.com') {
    const base = document.getElementById('view_container');
    if (base) {
      initGoogle(base);
    } else {
      setTimeout(init, 500);
    }
  }
}

init();
