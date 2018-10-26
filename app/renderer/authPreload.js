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
}

function initSelfHost(base) {
  hideNode('#header', base);
  hideNode('#footer', base);
  hideNode('#login-form .checkbox', base);
  document.body.style.minWidth = 'auto';
  document.body.style.width = 'auto';
  const panel = base.querySelector('.aui-page-panel');
  if (panel) {
    panel.style.marginTop = '35px';
    panel.style.maxWidth = '345px';

    const a = document.createElement('a');
    a.innerHTML = 'Back to Jira';
    panel.appendChild(a);
    a.addEventListener('click', (ev) => {
      ev.preventDefault();
      back();
    });
  }

  store.dispatch(
    uiActions.setUiState('authFormIsComplete', true, 'allRenderer'),
  );
}

function init() {
  if (global.location.host === 'id.atlassian.com') {
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
  } else if (global.location.pathname.endsWith('/login.jsp')
    || global.location.pathname.endsWith('/secure/ForgotLoginDetails.jspa')) {
    const base = document.getElementById('page');
    if (base) {
      initSelfHost(base);
    } else {
      setTimeout(init, 500);
    }
  }
}

init();
