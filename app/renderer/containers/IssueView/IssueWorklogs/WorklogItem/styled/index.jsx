import styled from 'styled-components';


export const WorklogContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  background-color: ${props => (props.selected ? '#f4f5f7' : 'transparent')};
  &:hover {
    background-color: #f4f5f7 !important;
  };
  flex: 1 0 0%;
`;

export const UserAvatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  user-select: none;
  margin-right: 8px;
`;

export const WorklogActions = styled.div`
  display: flex;
  align-self: flex-end;
  flex-flow: row nowrap;
  margin-left: auto;
  > div {
    cursor: pointer;
    &:hover {
      color: black;
    }
  }
`;

export const Edited = styled.span`
  margin-left: 5px;
  span {
    color: #de350b;
  }
`;
