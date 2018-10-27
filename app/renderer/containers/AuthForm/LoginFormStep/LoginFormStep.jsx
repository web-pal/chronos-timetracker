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
    const src = `${host.href}login.jsp`;

    let webview = document.querySelector('webview');
    if (!webview) {
      webview = document.createElement('webview');
      webview.setAttribute('preload', getPreload('authPreload'));

      webview.addEventListener('did-navigate', ({ url }) => {
        webview.focus();
        if (process.env.NODE_ENV === 'development') {
          webview.openDevTools();
        }

        /*
        if (url.includes('login.jsp')) {
          this.props.onError('Team not found');
          this.props.onBack();
        }
        */
        console.log('-_________');
        console.log(url);
        console.log('-_________');

        if (
          url.includes('secure/Dashboard.jspa')
          || url.includes('secure/MyJiraHome.jspa')
          || url.includes('secure/WelcomeToJIRA.jspa')
        ) {
          const { session } = webview.getWebContents();
          console.log(session.cookies);
          console.log(host);
          session.cookies.get({
            name: 'JSESSIONID',
            domain: host.hostname,
          }, (error, cookies) => {
            if (cookies && cookies.length) {
              this.props.onContinue({
                host,
                cookie: {
                  name: 'JSESSIONID',
                  value: cookies[0].value,
                },
              });
            }
            session.clearStorageData([]);
          });
          session.cookies.get({
            name: 'cloud.session.token',
            domain: host.hostname,
          }, (error, cookies) => {
            if (cookies && cookies.length) {
              this.props.onContinue({
                host,
                cookie: {
                  name: 'cloud.session.token',
                  value: cookies[0].value,
                },
              });
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
          {/* <Spinner size="xlarge" isCompleting={loading} /> */}
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
