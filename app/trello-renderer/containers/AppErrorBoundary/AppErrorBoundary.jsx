import React from 'react';
import * as Sentry from '@sentry/electron';

import {
  AppContainer,
} from 'trello-containers';


class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error });
    Sentry.withScope((scope) => {
      Object.keys(errorInfo).forEach((key) => {
        scope.setExtra(key, errorInfo[key]);
      });
      Sentry.captureException(error);
    });
  }

  render() {
    const { error } = this.state;
    if (error) {
      return (
        <div>
          Error
        </div>
      );
    }
    return (
      <AppContainer />
    );
  }
}

export default AppErrorBoundary;
