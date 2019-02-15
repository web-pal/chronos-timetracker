import React from 'react';
import DownloadAttachment from 'components/AttachmentPopup/DownloadAttachment';
import {
  DescriptionAttachmentItem,
  DescriptionAttachmentsList,
  MainDescriptionAttachmentContainer,
  DescriptionAttachmentTitle,
  ItemContainer,
  ItemImage,
  AttachmentDescription,
  InfoConatiner,
  DateAttachment,
  SizeAttachment,
} from './styled';

const DescriptionSectionAttachment = ({ attachment }) => (
  <MainDescriptionAttachmentContainer>
    <DescriptionAttachmentTitle>
      {
        attachment.length === 0
          ? 'No Attachment' : 'Attachment'
      }
    </DescriptionAttachmentTitle>
    {
      attachment.length === 0 ? null : (
        <DescriptionAttachmentsList>
          {
            attachment.map(item => (
              <DescriptionAttachmentItem
                key={item.id}
              >
                <ItemContainer>
                  {
                    item.mimeType.indexOf('application')
                      ? (
                        <ItemImage
                          src={item.content}
                          alt="attachment"
                        />
                      )
                      : (
                        <DownloadAttachment
                          attachment={item}
                        />
                      )
                  }

                  <AttachmentDescription>
                    {item.filename}
                  </AttachmentDescription>
                  <InfoConatiner>
                    <DateAttachment>
                      {item.created}
                    </DateAttachment>
                    <SizeAttachment>
                      {item.size}
                    </SizeAttachment>
                  </InfoConatiner>
                </ItemContainer>
              </DescriptionAttachmentItem>
            ))
          }
        </DescriptionAttachmentsList>
      )
    }
  </MainDescriptionAttachmentContainer>
);

export default DescriptionSectionAttachment;
