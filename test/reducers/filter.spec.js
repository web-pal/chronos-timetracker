import { expect } from 'chai';
import filter, { initialState } from '../../app/reducers/filter.js';
import * as types from '../../app/constants/index.js';

describe('reducers', () => {
  describe('filter', () => {
    it('should handle initial state', () => {
      expect(filter(undefined, {})).to.equal(initialState);
    });

    it('should handle CHANGE_FILTER', () => {
      const action = {
        type: types.CHANGE_FILTER,
        payload: 'test',
      }
      expect(filter(undefined, action)).to.have.property('value', 'test');
    });

    it('should handle CHANGE_RESOLVE_FILTER', () => {
      const action = {
        type: types.CHANGE_RESOLVE_FILTER,
        payload: true,
      }
      expect(filter(undefined, action)).to.have.property('resolveValue', true);
    });

    it('should handle CLEAR_FILTER', () => {
      const action = {
        type: types.CLEAR_FILTER,
      }
      expect(filter(undefined, action)).to.have.property('value', '');
    });

    it('should handle unknown action type', () => {
      const action = {
        type: 'unknown',
      }
      expect(filter(undefined, action)).to.equal(initialState);
    });
  });
});
