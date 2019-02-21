// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';
import {
  uiActions,
} from 'actions';

import type {
  Node,
  StatelessFunctionalComponent,
} from 'react';
import type {
  Connector,
} from 'react-redux';

import {
  settingsActions,
} from 'actions';
import {
  getUiState,
} from 'selectors';

import type {
  Dispatch,
} from 'types';

import {
  ipcRenderer,
} from 'electron';

import {
  openURLInBrowser,
} from 'utils/external-open-util';

import Tooltip from '@atlaskit/tooltip';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import FileIcon from '@atlaskit/icon/glyph/file';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import EditorRemoveIcon from '@atlaskit/icon/glyph/editor/remove';

import * as S from './styled';

type Props = {
  show: boolean,
  messages: Array<{ string?: string, json?: any }>,
  dispatch: Dispatch,
};

const AuthDebugger: StatelessFunctionalComponent<Props> = ({
  show,
  messages,
  dispatch,
}: Props): Node => (
  <S.AuthDebugger show={show}>
    <S.DebugHeader>
      <S.DebugHeaderTitle>
        Auth debug console 📺
      </S.DebugHeaderTitle>
      <S.DebugActions>
        <Tooltip content="Clear cache">
          <EditorRemoveIcon
            onClick={() => {
              dispatch(
                settingsActions.clearElectronCache(),
              );
            }}
          />
        </Tooltip>
        <Tooltip content="Copy to clipboard">
          <CopyIcon onClick={() => ipcRenderer.send('copy-login-debug', messages)} />
        </Tooltip>
        <Tooltip content="Save to file">
          <FileIcon onClick={() => ipcRenderer.send('save-login-debug', messages)} />
        </Tooltip>
        <Tooltip content="Report issue">
          <ShortcutIcon onClick={openURLInBrowser('https://github.com/web-pal/chronos-timetracker/issues/new')} />
        </Tooltip>
        <Tooltip content="Close dialog">
          <CrossIcon
            onClick={() => {
              dispatch(uiActions.setUiState({
                showAuthDebugConsole: false,
              }));
            }}
          />
        </Tooltip>
      </S.DebugActions>
    </S.DebugHeader>
    <S.AuthDebuggerBody>
      {messages.map((message, key) => (
        <S.DebugMessage key={key}>
          {message.string
            ? (
              <div>
                {message.string}
              </div>
            )
            : (
              <pre style={{ whiteSpace: 'pre-wrap', maxWidth: '100%' }}>
                {JSON.stringify(message.json, null, 2) }
              </pre>
            )
          }
        </S.DebugMessage>
      ))}
    </S.AuthDebuggerBody>
  </S.AuthDebugger>
);

function mapStateToProps(state) {
  return {
    messages: getUiState('authDebugMessages')(state),
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(AuthDebugger);
