import React from 'react';
import './assets/stylesheets/main.less';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
import Base from './components/Base/Base';

const store = configureStore();

render(
  <Provider store={store}>
    <Base />
  </Provider>,
  document.getElementById('root')
);
