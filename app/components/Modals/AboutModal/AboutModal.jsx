import React from 'react';
import ModalDialog from '@atlaskit/modal-dialog';
import ButtonGroup from '@atlaskit/button-group';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { hourgrass, hourgrassWhite, hourgrassGreen, stopwatch } from 'data/svg';

import * as uiActions from '../../../actions/ui';

const StopwatchImage = styled.img`
  height: 18px;
  margin-right: 5px;
  margin-right: 5px;
  position: absolute;
  right: 107px;
  height: 108px;
  opacity: 0.15;
`;

import Flex from '../../../components/Base/Flex/Flex';
import {} from './styled';
import {
  H100,
  H200,
  H300,
  H400,
  H500,
  H600,
  H700,
  H800,
  Link,
} from '../../../styles/typography';
import {
  Button,
} from '../../../styles/buttons';

// eslint-disable-next-line
const AboutModal = ({ isOpen, setShowAboutModal }) => (
  <ModalDialog
    onDialogDismissed={() => setShowAboutModal(false)}
    isOpen={isOpen}
  >
    <Flex
      column
      style={{
        margin: '10px 5px',
      }}
    >
      <Flex column>
        <H500 style={{ marginBottom: 10, marginTop: 10 }}>
          <StopwatchImage src={stopwatch} alt="" />
          Idle time alert
        </H500>
        <span>
          You were inactive from 17:30 to 18:04 <b>(34 minutes)</b>.
          <br />
          Do you want to keep this time?
        </span>
        <Flex row style={{ marginTop: 10, marginBottom: 10 }}>
          <Button
            background="hsla(40, 100%, 45%, 1)"
            style={{
              marginRight: 5,
              display: 'flex',
              justifyContent: 'center',
              width: 76,
            }}
          >
            Dismiss
          </Button>
          <Button
            background="#36B37E"
            style={{
              width: 76,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            Keep
          </Button>
        </Flex>
      </Flex>
    </Flex>
    {/*
    <Flex column>
      <H800>Welcome to the Research Operations monthly!</H800>
      <H700>Welcome to the Research Operations monthly!</H700>
      <H600>Welcome to the Research Operations monthly!</H600>
      <H500>Welcome to the Research Operations monthly!</H500>
      <H400>Welcome to the Research Operations monthly!</H400>
      <H300>Welcome to the Research Operations monthly!</H300>
      <H200>Welcome to the Research Operations monthly!</H200>
      <H100>Welcome to the Research Operations monthly!</H100>
      <Link>Welcome to the Research Operations monthly!</Link>
    </Flex>
    */}
  </ModalDialog>
);

function mapStateToProps({ ui }) {
  return {
    isOpen: ui.showAboutModal,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(uiActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutModal);
