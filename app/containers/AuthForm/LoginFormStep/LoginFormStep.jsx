import React, { Component } from 'react';
import Spinner from '@atlaskit/spinner';

import {
  transformValidHost,
} from '../../../sagas/auth';

import {
  ContentInner,
  ContentStep,
  WebViewContainer,
} from '../styled';

type Props = {
  host: string,
  isActiveStep: boolean,
  authRequestInProcess: boolean,
  onContinue: () => void,
  onError: () => void,
  onBack: () => void,
};

type State = {
  isCompleting: boolean,
};

class LoginFormStep extends Component<Props, State> {
  state = {
    isCompleting: false,
  }

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
      webview.setAttribute('preload', './preload.js');
      webview.addEventListener('did-get-response-details', ({
        newURL,
        resourceType,
        httpResponseCode,
      }) => {
        if (resourceType === 'mainFrame') {
          console.log('mainFrame', newURL);
          if (httpResponseCode === 404) {
            this.props.onError('Team not found');
            this.props.onBack();
          } else {
            this.showForm();
          }
        }
      });
      webview.addEventListener('ipc-message', (event) => {
        if (event.channel === 'back') {
          this.props.onBack();
          this.setState({ isCompleting: false });
        }
      });
      webview.addEventListener('did-navigate', ({ url }) => {
        if (url.includes('https://accounts.google.com/signin/')) {
          webview.openDevTools();
          this.showGoogleForm();
        }
        if (url.includes('secure/Dashboard.jspa') || url.includes('secure/MyJiraHome.jspa')) {
          const { session } = webview.getWebContents();
          session.cookies.get({
            name: 'cloud.session.token',
            domain: '.atlassian.net',
          }, (error, cookies) => {
            if (cookies && cookies.length) {
              this.props.onContinue({
                host,
                token: cookies[0].value,
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

  showForm() {
    const webview = document.querySelector('webview');
    webview.executeJavaScript(`
      var base = document.getElementById('root');
      var reset = document.getElementById('resetPassword');
      base.style.width = '100%';
      base.style.height = '100%';
      base.style.overflow = 'hidden';
      base.querySelector('header').style.display = 'none';
      base.querySelector('footer').style.display = 'none';
      document.getElementById('username').focus();

      reset.innerHTML = 'Back';
      reset.addEventListener('click', function(ev){
        ev.stopPropagation();
        ev.preventDefault();
        ipcRenderer.sendToHost('back');
      });
    `, false, () => {
      this.setState({ isCompleting: true });
    });
  }

  showGoogleForm() {
    const webview = document.querySelector('webview');
    webview.executeJavaScript(`
      console.log('run');
      var base = document.getElementById('view_container');
      document.querySelector('header').style.display = 'none';
      document.querySelector('footer').style.display = 'none';

      var = document.createElement('a');
      a.innerHTML = 'Back to Jira';
      base.appendChild(a);
      a.addEventListener('click', function(ev){
        ev.preventDefault();
        ipcRenderer.sendToHost('back');
      });
    `);
  }

  render() {
    const { isActiveStep, authRequestInProcess } = this.props;
    const { isCompleting } = this.state;
    const loading = isCompleting || authRequestInProcess;
    return (
      <ContentInner
        isActiveStep={isActiveStep}
        step={2}
      >
        <ContentStep>
          <Spinner size="xlarge" isCompleting={loading} />
          <WebViewContainer
            id="webviewContainer"
            isCompleting={loading}
          />
        </ContentStep>
      </ContentInner>
    );
  }
}

export default LoginFormStep;

