import styled from 'styled-components';

export const ShowAll = styled.div`
  width: 100%;
  align-items: center;
  height: 21%
`;

export const Item = styled.ul`
  margin: 0;
  padding: 0;
  height: 90%; 
  white-space:nowrap; 
  overflow-x: scroll;
  overflow-y: auto;
`;

export const ItemInside = styled.li`
  padding-top:20px;
  padding-left:10px;
  display: inline-block;
  width:150px;
  height:100px; 
`;

export const ItemImage = styled.div`
  width:100%;
  height:100%;
  display:flex;
  flex-direction:column;
  justify-content: space-around;
  align-items:center;
  background: rgb(70,70,70);
  cursor:pointer;
  overflow: hidden;
  
  &:hover{
    background: rgb(112,112,112);
  }
`;

export const Image = styled.img`
  width:80px;
  height:60px;
  object-fit: cover;
`;

export const DescriptionImage = styled.span`
  text-align:center;
  white-space: normal;
  color: white;
  width:100%;
  font-size: 12px;
`;
