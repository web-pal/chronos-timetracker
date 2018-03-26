// @flow
import React, { Component } from 'react';
import Raven from 'raven-js';

import { connect } from 'react-redux';


import Button from '@atlaskit/button';

import {
  settingsActions,
} from 'actions';


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
      return (
        <div>
          <h1>Something went wrong.</h1>
          You may try to &nbsp;
          <Button
            appearance="danger"
            onClick={() => this.props.dispatch(
              settingsActions.clearElectronCache(),
            )}
          >
            Clear cache
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default connect(
  null,
  dispatch => ({ dispatch }),
)(ErrorBoundary);
