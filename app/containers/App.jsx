import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import WindowsControlButtons from '../components/WindowsControlButtons/WindowsControlButtons';
import AuthForm from './AuthForm';
import FetchWrapper from './FetchWrapper';
import Main from '../components/Main';

const App = ({ isAuthorized }) =>
  <FetchWrapper>
    {process.platform !== 'darwin' &&
      <WindowsControlButtons />
    }
    {isAuthorized
      ? <Main />
      : <AuthForm />
    }
  </FetchWrapper>;

App.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
};

function mapStateToProps({ profile }) {
  return {
    isAuthorized: profile.isAuthorized,
  };
}

export default connect(mapStateToProps, null)(App);
