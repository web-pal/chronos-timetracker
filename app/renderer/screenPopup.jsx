// @flow
import React from 'react';
import { render } from 'react-dom';

import ScreenPopup from './containers/Popups/ScreenPopup/ScreenPopup';

render(
  <div id="root">
    <ScreenPopup />
  </div>,
  document.getElementById('root') || document.createElement('div'),
);
