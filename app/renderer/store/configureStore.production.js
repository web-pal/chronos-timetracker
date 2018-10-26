import {
  compose,
  createStore,
  applyMiddleware,
} from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';

import rendererEnhancer from './middleware';
import rootReducer from '../reducers';


export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [
    rendererEnhancer,
    sagaMiddleware,
  ].filter(Boolean);
  const enhancer = compose(
    applyMiddleware(...middlewares),
  );
  const store = createStore(
    rootReducer,
    initialState,
    enhancer,
  );

  store.runSaga = sagaMiddleware.run;
  store.close = () => store.dispatch(END);
  return store;
}
