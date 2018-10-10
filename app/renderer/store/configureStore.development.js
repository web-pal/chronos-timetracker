import {
  createStore,
  applyMiddleware,
  compose,
} from 'redux';
import {
  createLogger,
} from 'redux-logger';
import createSagaMiddleware, { END } from 'redux-saga';

import config from 'config';

import rendererEnhancer from './middleware';
import rootReducer from '../reducers';

const logger = createLogger({
  level: 'info',
  collapsed: true,
});

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */


export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [
    rendererEnhancer,
    sagaMiddleware,
    // config.reduxLogger && logger,
  ].filter(Boolean);
  const enhancer = composeEnhancers(
    applyMiddleware(...middlewares),
  );
  const store = createStore(
    rootReducer,
    initialState,
    enhancer,
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers/', () => {
      const nextRootReducer = require('../reducers'); //eslint-disable-line
      store.replaceReducer(nextRootReducer);
    });
  }


  store.runSaga = sagaMiddleware.run;
  store.close = () => store.dispatch(END);
  return store;
}
