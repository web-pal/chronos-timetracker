import React, {
  useEffect,
} from 'react';

import {
  getPreload,
} from 'trello-utils';
import config from 'config';

import * as S from './styled';


const AuthForm = () => {
  useEffect(() => {
    if (config.loginTrelloWindowDevTools) {
      const webview = document.querySelector('webview');
      webview.addEventListener('dom-ready', () => {
        webview.openDevTools();
      });
    }
  });

  return (
    <S.AuthFormWrapper>
      <S.WebviewWrapper
        id="webviewContainer"
      >
        <webview
          src={[
            'https://trello.com/1/authorize?expiration=never&',
            `scope=read,write,account&response_type=token&name=Server%20Token&key=${config.trelloApiKey}`,
          ].join('')}
          preload={`file:${getPreload('trelloAuthPreload')}`}
          autosize="on"
          style={{
            display: 'inline-flex',
            width: '400px',
            height: '680px',
          }}
        />
      </S.WebviewWrapper>
    </S.AuthFormWrapper>
  );
};

export default AuthForm;
