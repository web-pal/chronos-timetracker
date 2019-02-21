// @flow
import * as eff from 'redux-saga/effects';


export function* throwError(err: any): Generator<*, void, *> {
  yield eff.call(console.error, err);
}
