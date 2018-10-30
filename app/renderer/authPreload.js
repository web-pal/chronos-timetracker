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

function back(error = null) {
  store.dispatch(
    uiActions.setUiState('authFormStep', 1, 'allRenderer'),
  );
  store.dispatch(
    uiActions.setUiState('authFormIsComplete', false, 'allRenderer'),
  );
  store.dispatch(uiActions.setUiState('authError', error, 'allRenderer'));
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

  reset.innerHTML = 'Back';
  reset.addEventListener('click', (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    back();
  });
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
  store.dispatch(
    uiActions.setUiState('authFormIsComplete', true, 'allRenderer'),
  );
}

function init() {
  store.dispatch(
    uiActions.setUiState('authFormIsComplete', false, 'allRenderer'),
  );
  if (global.location.host === 'id.atlassian.com' && global.location.pathname === '/login') {
    const base = document.getElementById('root');
    const reset = document.getElementById('resetPassword');
    if (base && reset) {
      initAtlassian(base, reset);
    } else {
      setTimeout(init, 500);
    }
  } else if (global.location.host === 'accounts.google.com') {
    const base = document.getElementById('view_container');
    if (base) {
      initGoogle(base);
    } else {
      setTimeout(init, 500);
    }
  } else if (global.location.pathname === '/login') {
    back('Something has gone wrong');
  } else {
    setTimeout(init, 500);
  }
}

init();
