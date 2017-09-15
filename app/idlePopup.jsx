import React from 'react';
import { render } from 'react-dom';

import IdlePopup from './components/Popups/IdlePopup/IdlePopup';

render(
  <div id="root">
    <IdlePopup />
  </div>,
  document.getElementById('root'),
);
