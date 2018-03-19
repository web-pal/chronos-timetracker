// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';

import type {
  Node,
  StatelessFunctionalComponent,
} from 'react';
import type {
  Connector,
} from 'react-redux';

import {
  getUiState,
} from 'selectors';

import {
  AuthDebuggerContainer,
  DebugMessage,
} from './styled';


type Props = {
  show: boolean,
  messages: Array<string>,
}

const AuthDebugger: StatelessFunctionalComponent<Props> = ({
  show,
  messages,
}: Props): Node =>
  <AuthDebuggerContainer show={show}>
    <DebugMessage>
      Auth debug console 📺
    </DebugMessage>
    {messages.map((message, key) =>
      <DebugMessage key={key}>
        {message.string ?
          <div>
            {message.string}
          </div> :
          <pre>
            {JSON.stringify(message.json, null, 2) }
          </pre>
        }
      </DebugMessage>
    )}
  </AuthDebuggerContainer>

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
