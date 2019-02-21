import createSagaMiddleware, {
  END,
} from 'redux-saga';
import {
  createStore,
  applyMiddleware,
  compose,
} from 'redux';

import rendererEnhancer from './middleware';
import rootReducer from '../reducers';

const sagaMiddleware = createSagaMiddleware();
const middleware = [
  rendererEnhancer,
  sagaMiddleware,
].filter(Boolean);


function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, compose(
    applyMiddleware(...middleware),
  ));

  store.runSaga = sagaMiddleware.run;
  store.close = () => store.dispatch(END);
  return store;
}

export default configureStore;
