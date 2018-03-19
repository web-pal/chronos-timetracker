import styled from 'styled-components';


export const AuthDebuggerContainer = styled.div`
  position: absolute;
  display: flex;
  flex-flow: column nowrap;
  left: 0;
  top: 0;
  height: 100%;
  width: 500px;
  z-index: 100;
  background: #1D1F21;
  box-shadow: 0px 13px 17px -6px rgba(0, 0, 0, 0.38);
  text-align: left;
  color: #fff;
  transform: ${props =>
    (props.show ?
      'translate3d(0px, 0px, 0px)' :
      'translate3d(-100%, 0px, 0px)'
    )};
  transition: transform .3s ease-out;
`;

export const AuthDebuggerBody = styled.div`
  overflow: auto;
`;

export const DebugMessage = styled.div`
  display: -webkit-box;
  padding: 4px;
  &:not(:last-child) {
    border-bottom: 1px solid #333;
  }
`;

export const DebugHeaderTitle = styled.span`
  font-weight: 500;
`;

export const DebugHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 4px 8px 4px;
  border-bottom: 1px solid #555;
`;

export const DebugActions = styled.div`
  display: flex;
  & > div {
    cursor: pointer;
  }
  & > div:last-child {
    margin-left: 8px;
  }
`;
