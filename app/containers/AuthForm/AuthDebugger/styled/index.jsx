import styled from 'styled-components';


export const AuthDebuggerContainer = styled.div`
  position: fixed;
  overflow: scroll;
  left: 0;
  top: 0;
  height: 100%;
  z-index: 100;
  padding-top: 30px;
  padding-left: 10px;
  min-width: 300px;
  background: #1D1F21;
  box-shadow: 0px 13px 17px -6px rgba(0, 0, 0, 0.38);
  text-align: left;
  color: #fff;
  transform: ${props =>
    (props.show ?
      'translate3d(0px, 0px, 0px)' :
      'translate3d(-380px, 0px, 0px)'
    )};
`;

export const DebugMessage = styled.div`
  display: -webkit-box;
`;
