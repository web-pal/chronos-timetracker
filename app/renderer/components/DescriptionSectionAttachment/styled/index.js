import styled from 'styled-components';

export const DescriptionAttachmentTitle = styled.span`
  padding-bottom: 10px;
  font-size:16px;
  cursor: pointer;
`;

export const MainDescriptionAttachmentContainer = styled.div`
  width: 100%;
  margin-top: 20px;
  padding-bottom: 90px;
`;

export const DescriptionAttachmentsList = styled.ul`
  display:flex;
  flex-wrap:wrap;
  justify-content:space-around;
  align-items:center;
  margin: 10px 0;
  padding: 0;
  list-style-type: none;
  list-style-image: none;
  border-style:dashed;
  border-width: 1px;
  border-color: grey;
`;

export const DescriptionAttachmentItem = styled.li`
  cursor: pointer;
  float: left;
  margin: 10px;
  width: 170px;
  height: 170px;
`;

export const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content:space-around;
  align-items: center;
  width:100%;
  height:100%;
  
  &:hover {
    background: rgb(239,239,239);
  }
`;

export const ItemImage = styled.img`
  width: 150px;
  height: 120px;
`;

export const InfoConatiner = styled.div`
  display:flex;
  width:90%;
`;

export const SizeAttachment = styled.span`
  text-align:right;
  width: 20%;
  font-size: 10px;
`;

export const DateAttachment = styled.span`
  width: 80%;
  font-size: 10px;
`;

export const AttachmentDescription = styled.span`
  cursor: default;
  text-align: center;
  width: 100%;
  font-size: 12px;
`;
