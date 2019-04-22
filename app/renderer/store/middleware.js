import {
  remote,
  ipcRenderer,
} from 'electron';

import {
  actionTypes,
} from 'shared/actions';
import {
  timerActions,
  uiActions,
} from 'actions';

const isNumber = n => typeof n === 'number';

const rendererEnhancer = (store) => {
  const channel = 'electron-actions';
  const sourceId = remote.getCurrentWindow()?.id;
  const handler = (event, action) => (store.dispatch(action));

  ipcRenderer.on(channel, handler);

  window.addEventListener('beforeunload', (ev) => {
    const stopClose = (
      sourceId === 1
      && !store.getState().ui.readyToQuit
    ) || (
      window.CHRONOS_ISSUE_WINDOW
    );
    if (stopClose) {
      let continueclose = true;
      if (store.getState()?.timer?.running) {
        continueclose = false;
        setTimeout(() => {
          store.dispatch(timerActions.stopTimerRequest(true));
        }, 100);
      }
      if (store.getState()?.ui?.saveWorklogInProcess) {
        continueclose = false;
        setTimeout(() => {
          store.dispatch(uiActions.setUiState({
            quitAfterSaveWorklog: true,
          }));
          window.alert('Currently app in process of saving worklog, wait few seconds please');
        }, 100);
      }
      if (continueclose) {
        setTimeout(() => {
          store.dispatch({ type: actionTypes.QUIT_REQUEST });
        }, 100);
      }
      if (window.CHRONOS_ISSUE_WINDOW) {
        try {
          document.getElementsByClassName('cancel')[0].click();
          (
            document.getElementById('edit-issue-submit')
            || document.getElementById('create-issue-submit')
          ).nextElementSibling.click();
        } catch (err) {
          console.log(err);
        }
      }
      ev.returnValue = false; // eslint-disable-line
    } else {
      store.dispatch({ type: actionTypes.WINDOW_BEFORE_UNLOAD });
      ipcRenderer.removeListener(channel, handler);
    }
  });

  return next => (action) => {
    if (
      !action.sourceId
      && action.scope
    ) {
      const signedAction = {
        ...action,
        sourceId,
      };
      const scopes = (
        Array.isArray(action.scope) ? action.scope : [action.scope]
      );
      const toMain = [
        'all',
        'main',
      ];
      const toAllRenderer = [
        'all',
        'allRenderer',
      ];
      const allReserverd = [
        ...toAllRenderer,
        ...toMain,
      ];

      const scopesRegister = store.getState().windowsManager.scopes;
      const targetWinIds = [].concat.apply(
        [],
        [
          ...scopes
            .filter(
              s => (
                !allReserverd.includes(s)
                && (
                  isNumber(s)
                  || scopesRegister[s]
                )
              ),
            )
            .map(
              s => (
                isNumber(s)
                  ? [s]
                  : scopesRegister[s]
              ),
            ),
        ],
      );


      if (scopes.some(s => toMain.includes(s))) {
        /* Main process */
        ipcRenderer.send(
          channel,
          signedAction,
        );
      }

      remote.BrowserWindow
        .getAllWindows()
        .filter(
          win => (
            (
              scopes.some(s => toAllRenderer.includes(s))
              || targetWinIds.includes(win.id)
            ) && (
              !win.isDestroyed()
            )
          ),
        )
        .forEach(
          win => (
            win.webContents.send(
              channel,
              signedAction,
            )
          ),
        );
    } else {
      next(action);
    }
  };
};
export default rendererEnhancer;
