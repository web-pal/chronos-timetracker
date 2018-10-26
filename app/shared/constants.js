/* https://electronjs.org/docs/api/browser-window#instance-events */
export const browserWindowInstanceEvents = [
  'page-title-updated',
  'session-end',
  'unresponsive',
  'responsive',
  'blur',
  'focus',
  'show',
  'hide',
  'ready-to-show',
  'maximize',
  'unmaximize',
  'minimize',
  'restore',
  'resize',
  'close',
  'closed',
  'move',
  'moved',
  'enter-full-screen',
  'leave-full-screen',
  'enter-html-full-screen',
  'leave-html-full-screen',
  'app-command',
  'scroll-touch-begin',
  'scroll-touch-end',
  'scroll-touch-edge',
  'swipe',
  'sheet-begin',
  'sheet-end',
  'new-window-for-tab',
];

/* https://electronjs.org/docs/api/browser-window?query=wi#instance-methods */
export const browserWindowInstanceMethods = [
  {
    name: 'destroy',
    description: [
      'Force closing the window,',
      'the unload and beforeunload event won\'t be emitted for the web page,',
      'and close event will also not be emitted for this window,',
      'but it guarantees the closed event will be emitted.',
    ].join(''),
  },
  {
    name: 'close',
    description: [
      'Try to close the window.',
      'This has the same effect as a user manually clicking the close button of the window.',
      'The web page may cancel the close though. See the close event.',
    ].join(''),
  },
  {
    name: 'focus',
    description: 'Focuses on the window.',
  },
  {
    name: 'show',
    description: 'Shows and gives focus to the window.',
  },
];
/* https://electronjs.org/docs/api/web-contents#instance-methods */
export const webContentsInstanceMethods = [
  {
    name: 'getTitle',
    description: 'Returns String - The title of the current web page.',
  },
];

/* https://electronjs.org/docs/api/web-contents#instance-events */
/*
 * if you listen to the "console-message", there will be recursion at the console.log()
 */
export const webContentsInstanceEvents = [
  'did-finish-load',
  'did-fail-load',
  'did-frame-finish-load',
  'did-start-loading',
  'did-stop-loading',
  'did-get-response-details',
  'did-get-redirect-request',
  'dom-ready',
  'page-favicon-updated',
  'new-window',
  'will-navigate',
  'did-navigate',
  'did-navigate-in-page',
  'will-prevent-unload',
  'crashed',
  'plugin-crashed',
  'before-input-event',
  'devtools-opened',
  'devtools-closed',
  'devtools-focused',
  'certificate-error',
  'select-client-certificate',
  'login',
  'found-in-page',
  'media-started-playing',
  'media-paused',
  'did-change-theme-color',
  'cursor-changed',
  'context-menu',
  'select-bluetooth-device',
  'paint',
  'devtools-reload-page',
  'will-attach-webview',
  'did-attach-webview',
  // 'console-message',
];
