import fs from 'fs';
import rimraf from 'rimraf';
import { remote } from 'electron';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import WindowsControlButtons from '../components/WindowsControlButtons/WindowsControlButtons';
import AuthForm from './AuthForm';
import Main from '../containers/Main';

// Create directories for screens and worklogs
const appDir = remote.getGlobal('appDir');
fs.access(`${appDir}/screens/`, fs.constants.R_OK | fs.constants.W_OK, (err) => { // eslint-disable-line
  if (err) {
    fs.mkdirSync(`${appDir}/screens/`);
  }
});
// Remove legacy dir, after few versions we will remove this code (0.0.9)
fs.access(`${appDir}/screenshots/`, fs.constants.R_OK | fs.constants.W_OK, (err) => { // eslint-disable-line
  if (!err) {
    rimraf(`${appDir}/screenshots/`, () => console.log('removed old screenshots'));
  }
});
fs.access(`${appDir}/worklogs/`, fs.constants.R_OK | fs.constants.W_OK, (err) => { // eslint-disable-line
  if (err) {
    fs.mkdirSync(`${appDir}/worklogs/`);
  }
});

const App = ({ isAuthorized }) =>
  <div className="wrapper">
    {process.platform !== 'darwin' &&
      <WindowsControlButtons />
    }
    {isAuthorized
      ? <Main />
      : <AuthForm />
    }
  </div>;

App.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
};

function mapStateToProps({ profile }) {
  return {
    isAuthorized: profile.isAuthorized,
  };
}

export default connect(mapStateToProps)(App);
