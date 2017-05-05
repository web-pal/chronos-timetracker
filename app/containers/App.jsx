import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import AuthForm from './AuthForm';
import Main from './Main';

const App = ({ isAuthorized }) =>
  <div className="wrapper">
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
