import path from 'path';
import { remote, nativeImage } from 'electron';
import * as types from '../constants/timer';

import { stj } from '../helpers/time';

const tray = remote.getGlobal('tray');
const menu = remote.getGlobal('menu');
// menu.items[2] - "Start"
// menu.items[3] - "Stop"

const InitialState = Immutable.Record({
  time: 0,

  running: false,
  forceQuit: false,

  lastScreenshotTime: 0,
  currentIdleList: Immutable.List(),
  keepedIdles: Immutable.List(),
  screenShotsPeriods: [],
});

const initialState = new InitialState();

export default function timer(state = initialState, action) {
  switch (action.type) {
    case types.START_TIMER:
      menu.items[2].enabled = false;
      menu.items[3].enabled = true;

      // DUNNO HOW TO DEAL WITH IT
      // tray.setPressedImage(nativeImage.createFromDataURL('../assets/images/icon.png'));
      // tray.setPressedImage(nativeImage.createFromPath('/Users/ignatif/Projects/chronos-app-jira/app/assets/images/icon.png'));
      // tray.setPressedImage(require('../assets/images/icon.png'));
      // tray.setPressedImage(path.join(__dirname, 'assets', 'images', 'icon.png'));
      // tray.setPressedImage(nativeImage.createFromPath(path.join(__dirname, './assets/images/icon.png')));
      // tray.setPressedImage(path.join(__dirname, '../assets/images/icon.png'));

      return state.set('running', true);
    case types.STOP_TIMER:
      tray.setTitle('');
      menu.items[2].enabled = true;
      menu.items[3].enabled = false;

      return state.set('running', false);

    case types.TICK:
      tray.setTitle(`${stj(state.time + 1, 'HH:MM')}`);
      return state.set('time', state.time + 1);
    case types.SET_TIME:
      return state.set('time', action.payload);
    case types.DISMISS_IDLE_TIME:
      return state.set('time', state.time - action.payload);
    case types.SAVE_KEEP_IDLE:
      return state.update('keepedIdles', idles => idles.push(action.payload));

    case types.SET_LAST_SCREENSHOT_TIME:
      return state.set('lastScreenshotTime', action.payload);
    case types.SET_FORCE_QUIT_FLAG:
      return state.set('forceQuit', action.payload);
    case types.SET_PERIODS:
      return state.set('screenShotsPeriods', action.payload);

    case types.ADD_IDLE:
      return state.update('currentIdleList', list => list.push(action.payload));
    case types.CUT_IDDLES:
      return state.withMutations((state) => { // eslint-disable-line
        [...Array(action.payload).keys()].forEach(() => {
          state.update('currentIdleList', list => list.pop());
        });
      });
    case types.CLEAR_CURRENT_IDLE_LIST:
      return state
        .set('currentIdleList', Immutable.List())
        .set('keepedIdles', Immutable.List());

    default:
      return state;
  }
}
