import React from 'react';
import { arrowDownWhite, stopWhite } from 'data/svg';
import Flex from '../../../components/Base/Flex/Flex';
import {
  NavButton,
  IssueName,
  Dot,
  Time,
  StopButton,
  Container,
} from './styled';

// isTrackingProp
// eslint-disable-next-line
export default ({ toggleTrackingView, isTrackingView }) => (
  <Container>
    <NavButton
      src={arrowDownWhite}
      alt=""
      onClick={toggleTrackingView}
      isTrackingView={isTrackingView}
    />
    <Flex row alignCenter>
      <IssueName>
        TTP-234
      </IssueName>
      <Dot />
      <Time>
        0:54
      </Time>
    </Flex>
    <StopButton src={stopWhite} alt="stop" />
  </Container>
);
