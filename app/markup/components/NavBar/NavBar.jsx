import React from 'react';

import { arrowLeft } from 'data/svg';
// import Flex from '../../../components/Base/Flex/Flex';
import {
  NavBar,
  BackIcon,
  Title,
  Action,
} from './styled';

// eslint-disable-next-line
export default ({ title }) => (
  <NavBar>
    <BackIcon src={arrowLeft} alt="Back" />
    <Title>
      {title}
    </Title>
    <Action>
      Clear
    </Action>
  </NavBar>
);
