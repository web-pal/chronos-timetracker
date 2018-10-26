import React, {
  Component,
} from 'react';
import Spinner from '@atlaskit/spinner';

import {
  transformValidHost,
} from 'sagas/auth';
import {
  getPreload,
} from 'utils/preload';

import {
  ContentInner,
  ContentStep,
  WebViewContainer,
} from '../styled';

type Props = {
  host: string,
  isActiveStep: boolean,
  isComplete: boolean,
  authRequestInProcess: boolean,
  onContinue: () => void,
  onError: () => void,
  onBack: () => void,
};

class LoginFormStep extends Component<Props, {}> {
  componentWillReceiveProps(nextProps: Props) {
    if (!this.props.isActiveStep && nextProps.isActiveStep) {
      this.loadUrl(nextProps.host);
    }
  }

  loadUrl(hostStr) {
    const host = transformValidHost(hostStr);
    const protocol = host.protocol.slice(0, -1);
    const baseUrl = `${host.origin}${host.pathname.replace(/\/$/, '')}`;
    const src = `${baseUrl}/login.jsp`;

    let webview = document.querySelector('webview');
    if (!webview) {
      webview = document.createElement('webview');
      webview.setAttribute('preload', getPreload('authPreload'));

      webview.addEventListener('will-navigate', ({ url }) => {
        console.log('will-navigate', url);
      });

      webview.addEventListener('did-navigate', ({ url }) => {
        console.log('did-navigate', url);
        webview.focus();
        if (process.env.NODE_ENV === 'development') {
          webview.openDevTools();
        }

        // if (url.includes('login.jsp')) {
        //   this.props.onError('Team not found');
        //   this.props.onBack();
        // }

        // TODO Fix
        if (url.replace(/\/$/, '') === baseUrl
          || url.includes('/issues')
          || url.includes('secure/Dashboard.jspa')
          || url.includes('secure/MyJiraHome.jspa')
          || url.includes('secure/WelcomeToJIRA.jspa')
        ) {
          const { session } = webview.getWebContents();
          const domain = (
            host.origin.includes('atlassian.net')
              ? '.atlassian.net'
              : host.hostname
          );
          session.cookies.get({
            domain,
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

export default LoginFormStep;
