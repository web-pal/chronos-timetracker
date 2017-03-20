import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import WindowsControlButtons from '../components/WindowsControlButtons/WindowsControlButtons';
import AuthForm from './AuthForm';
import Main from '../containers/Main';

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
