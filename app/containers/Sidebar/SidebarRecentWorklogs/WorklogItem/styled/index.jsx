import styled from 'styled-components2';

export const WorklogItemContainer = styled.div`

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px 20px;
  background: white;
  border-bottom: 1px solid #dfe1e6;
  cursor: pointer;

  button {
    opacity: 0;
    align-self: center;
    margin-left: auto;
    margin-right: 10px;
  }

  :hover {
    background-color: #EBECF0;

    button {
      opacity: 1;
    }
  }
  ${props => props.isSelected && `
    background-color: #ebf2f9;
    :hover {
      background-color: #e2edf9;
    }
  `}
`;

export const Summary = styled.span`
  color: #091E42;
  font-size: 12px;
  margin-bottom: 2px;
`;

export const IssueKey = styled.span`
  color: #091E42;
  margin-top: -3px;
  font-size: 13px;
  font-weight: 600;
  margin-right: 5px;
`;

export const Time = styled.span`
  color: #253858;
  font-weight: 500;
  font-size: 12px;
`;

export const IssueMeta = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  div {
    margin-right: 2px;
  }
`;

export const IssueType = styled.img`
  height: 14px;
  margin-bottom: -1px;
`;
