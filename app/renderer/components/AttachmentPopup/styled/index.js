import styled from 'styled-components';

export const MainAttachmentContainer = styled.div`
  position: absolute;
  width:100%;
  height: 100vh;
  top:0;
  bottom:0;
  right:0;
  left:0;
  background: rgb(64,64,64);
`;

export const HeaderContainer = styled.div`
  width: 100%;
  height: 50px;
  background:black;
  display: flex;   
`;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  width: 50%;
`;

export const DownloadButtonContainer = styled.div`
  display:flex;
  justify-content:flex-end;
  align-items: center;
  width: 50%; 
`;


export const TitleText = styled.span`
  padding-left: 10px;  
  font-size: 16px;
  color: white;
  cursor:default;
`;

export const DownloadButton = styled.a`
  background: black;
  display:flex;
  justify-content:center;
  align-items:center; 
  outline: none;
  border: none; 
  width: 50px;
  height: 100%;
  
  &:hover{
    cursor: pointer;
    background:rgb(150, 140, 140);
  }
`;

export const DownloadButtonIcon = styled.img`
  width: 16px;
  height: 16px;
 
`;

export const MainContentContainer = styled.div`
  width: 100%;
  height: 70%;
  display:flex;
`;

export const LeftButtonContainer = styled.div`
  display:flex;
  align-items:center;
  width: 20%;
  height:100%;  
`;

export const RightButtonContainer = styled.div`
  display:flex;
  align-items:center;
  justify-content:flex-end;
  width:20%;
  height:100%;
`;

export const MainImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60%;
  height: 100%;
`;

export const AttachmentImage = styled.img`
  width: 90%;
  height: 90%;
`;

export const LeftButton = styled.button`
  width:60px;
  height:100px;
  outline:none;
  cursor:pointer;
  background: none;
  border:none;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  
  &:hover{
    background:rgba(0,0,0,0.8);
  }
`;

export const RightButton = styled.button`
  width:60px;
  height:100px;
  outline:none;
  cursor:pointer;
  background:none;
  border:none;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  
  &:hover{
     background:rgba(0,0,0,0.8);
  }
`;

export const Arrow = styled.img``;
