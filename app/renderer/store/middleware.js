import {
  remote,
  ipcRenderer,
} from 'electron';

import {
  actionTypes,
} from 'shared/actions';

const isNumber = n => typeof n === 'number';

export default function rendererEnhancer(store) {
  const channel = 'electron-actions';
  const sourceId = remote.getCurrentWindow().id;
  const handler = (event, action) => (store.dispatch(action));

  ipcRenderer.on(channel, handler);

  window.addEventListener('beforeunload', () => {
    store.dispatch({ type: actionTypes.WINDOW_BEFORE_UNLOAD });
    ipcRenderer.removeListener(channel, handler);
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
}
