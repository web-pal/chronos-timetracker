import {
  ipcMain,
  BrowserWindow,
} from 'electron';

const isNumber = n => typeof n === 'number';

export default function main(store) {
  const channel = 'electron-actions';

  // Unsubscribe?
  ipcMain.on(
    channel,
    (event, action) => (
      store.dispatch(action)
    ),
  );

  return next => (action) => {
    if (
      !action.sourceId
      && action.scope
    ) {
      const scopes = (
        Array.isArray(action.scope) ? action.scope : [action.scope]
      );
      // Reserved system scopes
      const toMain = [
        'all',
        'main',
      ];
      const toSelf = [
        'all',
        'allRenderer',
      ];
      const toAllRenderer = [
        'all',
        'allRenderer',
      ];
      const allReserverd = [
        ...toSelf,
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

      BrowserWindow
        .getAllWindows()
        .filter(
          win => (
            scopes.includes('all')
            || targetWinIds.includes(win.id)
          ),
        )
        .forEach(
          win => (
            win.webContents.send(
              channel,
              {
                ...action,
                sourceId: 'main',
              },
            )
          ),
        );

      if (scopes.some(s => toMain.includes(s))) {
        next(action);
      }
    } else {
      next(action);
    }
  };
}
