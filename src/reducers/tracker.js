import * as types from '../constants/tracker';

const InitialState = Immutable.Record({
  time: 0,
  running: false,
  paused: false,
});

const initialState = new InitialState();

export default function tracker(state = initialState, action) {
  switch (action.type) {
    case types.TICK:
      return state.set('time', state.time + 1);
    case types.START: {
      if (state.paused) {
        return state.set('paused', false);
      }
      return state.set('running', true);
    }
    case types.STOP:
      return initialState;
    case types.PAUSE:
      return state.set('paused', true);
    default:
      return state;
  }
}
