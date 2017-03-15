import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import WindowsControlButtons from '../components/WindowsControlButtons/WindowsControlButtons';
import AuthForm from './AuthForm';
import FetchWrapper from './FetchWrapper';
import Main from '../components/Main';

const App = ({ connected }) =>
  <FetchWrapper>
    {process.platform !== 'darwin' &&
      <WindowsControlButtons />
    }
    {connected
      ? <Main />
      : <AuthForm />
    }
  </FetchWrapper>;

App.propTypes = {
  connected: PropTypes.bool.isRequired,
};

function mapStateToProps({ jira }) {
  return {
    connected: jira.connected,
  };
}

export default connect(mapStateToProps, null)(App);
