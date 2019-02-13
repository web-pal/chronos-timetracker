// @flow
import React from 'react';
import {
  render,
} from 'react-dom';
import {
  Provider,
} from 'react-redux';

import {
  createStore,
  applyMiddleware,
  combineReducers,
  compose,
} from 'redux';
import {
  windowsManager,
} from 'shared/reducers';
import {
  actionTypes,
} from 'actions';

import rendererEnhancer from './store/middleware';

import AttachmentPopup from './containers/Popups/AttachmentPopup';

const initialState = {
  attachments: [],
};

const attachmentReducer = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case actionTypes.SET_ATTACHMENTS:
      return {
        ...state,
        attachments: action.attachments,
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  windowsManager,
  attachmentReducer,
});

const store = createStore(
  rootReducer,
  {},
  compose(
    applyMiddleware(rendererEnhancer),
  ),
);

render(
  <Provider store={store}>
    <AttachmentPopup />
  </Provider>,
  document.getElementById('root'),
);
