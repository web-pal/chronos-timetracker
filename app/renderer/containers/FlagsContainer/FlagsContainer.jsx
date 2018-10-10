// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';
import type {
  Connector,
} from 'react-redux';
import type {
  Dispatch,
} from 'types';

import {
  uiActions,
} from 'actions';
import {
  getUiState,
} from 'selectors';

import {
  AutoDismissFlag as Flag,
  FlagGroup,
} from '@atlaskit/flag';

import {
  Code,
} from 'styles/typography';

import EditorWarningIcon from '@atlaskit/icon/glyph/editor/warning';
import NotificationAllIcon from '@atlaskit/icon/glyph/notification-all';
import SpinnerContainer from './SpinnerContainer';

import FlagHoc from './FlagHoc';


type Props = {
  flags: Array<any>,
  dispatch: Dispatch,
}

function getIcon(iconName) {
  return iconName === 'errorIcon' ?
    <EditorWarningIcon label="huy" size="medium" primaryColor="red" /> :
    <NotificationAllIcon label="pizda" size="medium" primaryColor="blue" />;
}

const FlagsContainer: StatelessFunctionalComponent<Props> = ({
  flags,
  dispatch,
}: Props): Node => (
  <FlagGroup
    onDismissed={(id) => {
      dispatch(uiActions.deleteFlag(id));
    }}
  >
    {flags.map(flag => (
      <FlagHoc
        key={flag.id}
        resourceType={flag.resourceType}
        request={flag.request}
        render={(pending) => {
          switch (flag.type) {
            case 'libSecretError':
              return (
                <Flag
                  title="libsecret error!"
                  appearance="normal"
                  icon={getIcon('errorIcon')}
                  actions={[
                    {
                      content: 'Got it!',
                      onClick: () => {
                        dispatch(uiActions.deleteFlag(flag.id));
                      },
                    },
                  ]}
                  description={
                    <div>
                      <div>
                        <p>
                          Currently this app uses <Code>libsecret</Code> so you
                          may need to install it.
                        </p>
                        <ul style={{ padding: 0 }}>
                          <li>Debian/Ubuntu: <Code>sudo apt-get install libsecret-1-0</Code></li>
                          <li>Red Hat-based: <Code>sudo yum install libsecret</Code></li>
                          <li>Arch Linux: <Code>sudo pacman -Sy libsecret</Code></li>
                        </ul>
                      </div>
                    </div>
                  }
                />
              );
            default:
              return (
                <Flag
                  title={
                    pending ?
                      <SpinnerContainer spinnerTitle={flag.spinnerTitle} /> :
                      flag.title
                  }
                  actions={flag.actions}
                  appearance={flag.appearance}
                  description={flag.description}
                  icon={getIcon(flag.icon)}
                />
              );
          }
        }}
      />
    ))}
  </FlagGroup>
);

function mapStateToProps(state) {
  return {
    flags: getUiState('flags')(state),
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(FlagsContainer);
