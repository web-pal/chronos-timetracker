import * as types from '../constants/timer';

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
      return state.set('running', true);
    case types.STOP_TIMER:
      return state.set('running', false);

    case types.TICK:
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
