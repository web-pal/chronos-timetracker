import * as types from '../constants/loadingBar';

export default function loadingBarReducer(state = 0, action = {}) {
  let newState

  switch (action.type) {
    case types.SHOW_LOADINGBAR:
      newState = state + 1
      break
    case types.HIDE_LOADINGBAR:
      newState = state > 0 ? state - 1 : 0
      break
    case types.RESET_LOADINGBAR:
      newState = 0
      break
    default:
      return state
  }

  return newState
}
