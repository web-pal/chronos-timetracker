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

import EditorWarningIcon from '@atlaskit/icon/glyph/editor/warning';
import NotificationAllIcon from '@atlaskit/icon/glyph/notification-all';
import Spinner from '@atlaskit/spinner';

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
        resourceName={flag.resourceName}
        request={flag.request}
        render={pending =>
          <Flag
            title={pending ? <Spinner /> : flag.title}
            actions={flag.actions}
            appearance={flag.appearance}
            description={flag.description}
            icon={getIcon(flag.icon)}
          />
        }
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
