import React, {
  Component,
} from 'react';
import Spinner from '@atlaskit/spinner';

import {
  getPreload,
} from 'utils/preload';

import {
  transformValidHost,
} from '../utils';

import {
  ContentInner,
  ContentStep,
  WebViewContainer,
} from '../styled';

type Props = {
  team: string,
  isActiveStep: boolean,
  isComplete: boolean,
  authRequestInProcess: boolean,
  onContinue: () => void,
  onError: () => void,
  onBack: () => void,
};

class CloudLoginStep extends Component<Props, {}> {
  componentWillReceiveProps(nextProps: Props) {
    if (!this.props.isActiveStep && nextProps.isActiveStep) {
      const host = transformValidHost(nextProps.team);
      this.loadUrl(host);
    }
  }

  loadUrl(host) {
    const protocol = host.protocol.slice(0, -1);
    const baseUrl = `${host.origin}${host.pathname.replace(/\/$/, '')}`;
    const src = `${baseUrl}/login.jsp`;

    let webview = document.querySelector('webview');
    if (!webview) {
      webview = document.createElement('webview');
      webview.setAttribute('preload', getPreload('authPreload'));

      webview.addEventListener('did-navigate', ({ url }) => {
        console.log('did-navigate', url);
        webview.focus();
        if (process.env.NODE_ENV === 'development') {
          webview.openDevTools();
        }

        if (url.includes('login.jsp')) {
          this.props.onError('Team not found');
          this.props.onBack();
        }

        // TODO Fix
        if (url.replace(/\/$/, '') === baseUrl
          || url.includes('/issues')
          || url.includes('secure/Dashboard')
          || url.includes('secure/MyJiraHome')
          || url.includes('secure/WelcomeToJIRA')
        ) {
          const { session } = webview.getWebContents();
          session.cookies.get({
            domain: '.atlassian.net',
          }, (error, cookies) => {
            console.log('error', error);
            console.log('cookies', cookies);
            if (cookies && cookies.length) {
              this.props.onContinue({
                cookies,
                protocol,
                hostname: host.hostname,
                port: host.port,
                pathname: host.pathname,
              });
            } else {
              this.props.onError('Can not authenticate user. Please try again');
              this.props.onBack();
            }
            session.clearStorageData([]);
          });
        }
      });

      webview.src = src;
      document.getElementById('webviewContainer').appendChild(webview);
    } else {
      const { session } = webview.getWebContents();
      session.clearStorageData([]);
      webview.src = src;
    }
  }

  render() {
    const { isComplete, isActiveStep, authRequestInProcess } = this.props;
    const loading = isComplete || authRequestInProcess;
    return (
      <ContentInner
        isActiveStep={isActiveStep}
        step={2}
      >
        <ContentStep>
          <Spinner size="xlarge" isCompleting={loading} />
          <WebViewContainer
            id="webviewContainer"
            isComplete={isComplete}
          />
        </ContentStep>
      </ContentInner>
    );
  }
}

export default CloudLoginStep;
