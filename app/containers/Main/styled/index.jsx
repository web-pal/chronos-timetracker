import styled from 'styled-components2';
import {
  Flex,
} from 'components';


export const MainContainer = styled(Flex).attrs({
  row: true,
})`
  height: 100%;
`;

export const LeftContainer = styled(Flex).attrs({
  column: true,
})`
  flex: 0 0 435px;
`;

