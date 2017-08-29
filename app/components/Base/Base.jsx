import React from 'react';

import App from '../../containers/App';
import Login from '../../markup/containers/Login/Login';

import '../../assets/stylesheets/main.less';

const Base = () =>
  <div className="wrapper">
    <Login />
  </div>;
    // <App />

export default Base;
