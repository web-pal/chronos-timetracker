import {
  createStore,
  applyMiddleware,
} from 'redux';
import createSagaMiddleware, {
  END,
} from 'redux-saga';

import mainEnhancer from './middleware';
import reducer from '../reducers';

const sagaMiddleware = createSagaMiddleware();
const middleware = [
  mainEnhancer,
  sagaMiddleware,
].filter(Boolean);

function configureStore(initialState = {}) {
  const store = createStore(
    reducer,
    initialState,
    applyMiddleware(...middleware),
  );
  store.runSaga = sagaMiddleware.run;
  store.close = () => store.dispatch(END);

  return store;
}

export default configureStore;
