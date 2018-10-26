import styled from 'styled-components';


export const IssueDetailsContainer = styled.div`
  margin-bottom: 20px;
`;

export const DetailsLabel = styled.span`
  color: rgb(112, 112, 112);
  margin-bottom: 5px;
`;

export const DetailsValue = styled.span`
  color: rgb(51, 51, 51);
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const IssueType = styled.img`
  height: 14px;
  margin-right: 3px;
`;

export const IssuePriority = styled.img`
  height: 14px;
  margin-right: 3px;
`;

export const IssueLabel = styled.span`
  margin-left: 5px;
  height: 16px;
  background: ${props => props.backgroundColor};
  border-radius: 3px;
  font-size: 12px;
  color: #FFFFFF;
  padding: 0px 4px;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const IssueEpic = styled.span`
  color: #fff;
  background-color: #815b3a;
  border-color: #815b3a;
  border-radius: 3.01px;
  padding: 1px 5px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Label = styled.span`
  background: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 3.01px;
  padding: 1px 5px;
  height: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #3b73af;
`;

// Attachments

export const AttachmentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 10px;
  padding: 10px;
  border: 1px dashed #b3bac5;
  border-radius: 3px;
`;

export const AttachmentsList = styled.div`
  display: flex;
  flex-flow: row wrap;
  margin-top: 10px;
`;

export const AttachmentItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
  height: 195px;
  margin: 0 15px 15px 0;
  cursor: pointer;
  box-sizing: border-box;
  :hover {
    background-color: #f0f0f0;
  }
`;

export const FileName = styled.a`
`;

export const MetaContainer = styled.div`
  display: flex;
  align-items: center;
  width: 180px;
  margin: 5px 10px;
`;

export const FileContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dfe1e6;
  border-radius: 3px;
  width: 100%;
  height: 145px;
`;

export const FileUploadDate = styled.span`
  color: #5e6c84;
  font-size: 12px;
`;

export const FileSize = styled.span`
  color: #5e6c84;
  font-size: 12px;

`;

export const DescriptionSectionHeader = styled.div`
  border-top: 2px solid rgba(0, 0, 0, .1);
  margin-top: 10px;
  padding-top: 10px;
  word-break: break-all;
`;

export const SectionHeader = styled.div`
  border-top: 2px solid rgba(0, 0, 0, .1);
  margin-top: 10px;
  padding-top: 10px;
  margin-bottom: 10px;
`;


export const DetailsColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 42%;
`;
