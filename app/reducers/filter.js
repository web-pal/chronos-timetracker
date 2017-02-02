import * as types from '../constants';
import Immutable from 'immutable';

const InitialState = new Immutable.Record({
  value: '',
  resolveValue: false,
});

export const initialState = new InitialState();

export default function filter(state = initialState, action) {
  switch (action.type) {
    case types.CHANGE_FILTER:
      return state.set('value', action.payload);
    case types.CLEAR_FILTER:
      return state.delete('value');
    case types.CHANGE_RESOLVE_FILTER:
      return state.set('resolveValue', action.payload);
    default:
      return state;
  }
}
