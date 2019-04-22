import styled from 'styled-components';
import EditFilledIcon from '@atlaskit/icon/glyph/edit-filled';
import {
  gridSize,
  fontSize,
} from '@atlaskit/theme';

export const EditButton = styled(EditFilledIcon)`
  cursor: pointer;
  background: white;
  height: 27px;
  width: 27px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 2px solid white;
  padding: 2px;
`;

export const EditButtonContainer = styled.div`
  cursor: pointer;
`;

export const IssueCommentCheckboxWrapper = styled.div`
  margin-left: -10px;
`;

export const ReadViewContainer = styled.div`
  display: flex;
  max-width: 100%;
  overflow: hidden;
  padding: ${gridSize()}px ${gridSize() - 2}px;
  font-size: ${fontSize()}px;
  height: ${(gridSize() * 2.5) / fontSize()}em;
  line-height: ${(gridSize() * 2.5) / fontSize()};
`;
