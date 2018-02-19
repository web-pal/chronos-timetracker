// @flow
import React, { Component } from 'react';
import Raven from 'raven-js';


class ErrorBoundary extends Component<any, any> {
  state = {
    hasError: false,
  }

  componentDidCatch(error: any, info: any) {
    console.error(error);
    this.setState({
      hasError: true,
    });
    Raven.captureException(
      error,
      {
        extra: {
          info,
          debugData: this.props.debugData,
        },
      },
    );
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
