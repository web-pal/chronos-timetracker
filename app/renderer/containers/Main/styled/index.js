import styled from 'styled-components';
import {
  Flex,
} from 'components';


export const Main = styled(Flex).attrs({
  row: true,
})`
  height: 100%;
`;

export const Left = styled(Flex).attrs({
  column: true,
})`
  flex: 0 0 435px;
`;
