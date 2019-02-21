import {
  createStore,
  applyMiddleware,
  compose,
} from 'redux';
import createSagaMiddleware, {
  END,
} from 'redux-saga';

import rendererEnhancer from './middleware';
import rootReducer from '../reducers';

const sagaMiddleware = createSagaMiddleware();
const middleware = [
  rendererEnhancer,
  sagaMiddleware,
].filter(Boolean);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware),
    ),
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      // eslint-disable-next-line
      store.replaceReducer(require('../reducers').default);
    });
  }

  store.runSaga = sagaMiddleware.run;
  store.close = () => store.dispatch(END);
  return store;
}

export default configureStore;
