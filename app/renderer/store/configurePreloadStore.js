import {
  createStore,
  applyMiddleware,
  combineReducers,
  compose,
} from 'redux';
import {
  windowsManager,
} from 'shared/reducers';

// import timers from './reducers/timers';
import rendererEnhancer from './middleware';

const rootReducer = combineReducers({
  // timers,
  windowsManager,
});

const middleware = [
  rendererEnhancer,
].filter(Boolean);

export default function configureStore(initialState = {}) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middleware),
    ),
  );

  return store;
}
