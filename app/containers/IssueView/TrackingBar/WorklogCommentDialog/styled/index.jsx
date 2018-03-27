import styled from 'styled-components';
import EditFilledIcon from '@atlaskit/icon/glyph/edit-filled';


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
