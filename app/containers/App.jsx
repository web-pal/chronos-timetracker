// @flow

import React from 'react';
import { connect } from 'react-redux';
import { getAuthorized } from 'selectors';
import type { Node, StatelessFunctionalComponent } from 'react';

import AuthForm from './AuthForm/AuthForm';
import Main from './Main/Main';

import type { State } from '../types';

type Props = {
  isAuthorized: boolean
};

const App: StatelessFunctionalComponent<Props> = (props: Props): Node => (
  <div>
    {props.isAuthorized
      ? <Main />
      : <AuthForm />
    }
  </div>
);

function mapStateToProps(state: State): Props {
  return {
    isAuthorized: getAuthorized(state),
  };
}

export default connect(mapStateToProps, () => ({}))(App);
