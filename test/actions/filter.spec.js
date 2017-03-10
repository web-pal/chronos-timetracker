import { expect } from 'chai';
import { spy } from 'sinon';
import * as actions from '../../app/actions/filter';
import * as types from '../constants/';

describe('actions', () => {
  describe('filter', () => {
    it('should changeFilter should create change action', () => {
      expect(actions.changeFilter('test')).to.deep.equal({
        type: types.CHANGE_FILTER,
        payload: 'test',
      });
    });

    it('should clear should create clear action', () => {
      expect(actions.clearFilter()).to.deep.equal({
        type: types.CLEAR_FILTER,
      });
    });

    it('should changeResolveFilter should create changeResolve action', () => {
      expect(actions.changeResolveFilter('test')).to.deep.equal({
        type: types.CHANGE_RESOLVE_FILTER,
        payload: 'test',
      });
    });
  });
});
