import React, {
  Component,
} from 'react';
import Spinner from '@atlaskit/spinner';

import config from 'config';
import {
  getPreload,
} from 'utils/preload';

import {
  transformValidHost,
} from '../utils';

import * as S from '../styled';

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

    if (this.props.isActiveStep && !nextProps.isActiveStep) {
      const webview = document.querySelector('webview');
      if (webview) {
        webview.parentNode.removeChild(webview);
      }
    }
  }

  loadUrl(host) {
    const protocol = host.protocol.slice(0, -1);
    const baseUrl = `${host.origin}${host.pathname.replace(/\/$/, '')}`;
    const src = `${baseUrl}/login.jsp`;

    let webview = document.querySelector('webview');
    if (!webview) {
      webview = document.createElement('webview');
      webview.setAttribute('autosize', 'on');
      webview.setAttribute(
        'preload',
        `file:${getPreload('authPreload')}`,
      );

      webview.addEventListener('did-navigate', ({ url }) => {
        const { session } = webview.getWebContents();
        session.cookies.get({
          domain: '.atlassian.net',
        }, (error, cookies) => {
          if (
            cookies
            && cookies.length
            && cookies.find(c => c.name === 'cloud.session.token')
          ) {
            this.props.onContinue({
              cookies,
              protocol,
              hostname: host.hostname,
              port: host.port,
              pathname: host.pathname,
            });
          }
        });
        if (config.loginWindowDevTools) {
          webview.openDevTools();
        }
        webview.addEventListener('dom-ready', () => {
          window.blur();
          window.focus();
          webview.focus();
        });

        if (url.includes('login.jsp')) {
          this.props.onError('Team not found');
          this.props.onBack();
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
    const {
      isComplete,
      isActiveStep,
      authRequestInProcess,
    } = this.props;
    const loading = isComplete && !authRequestInProcess;
    return (
      <S.ContentInner
        isActiveStep={isActiveStep}
        step={2}
      >
        <S.ContentStep>
          <Spinner
            size="xlarge"
            isCompleting={loading}
          />
          <S.WebView
            id="webviewContainer"
            isComplete={loading}
          />
        </S.ContentStep>
      </S.ContentInner>
    );
  }
}

export default CloudLoginStep;
