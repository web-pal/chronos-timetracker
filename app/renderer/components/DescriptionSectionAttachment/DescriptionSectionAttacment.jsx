import React from 'react';
import DownloadAttachment from 'components/AttachmentPopup/DownloadAttachment';
import * as S from './styled';


const DescriptionSectionAttachment = ({ attachment, showAttachmentWindow }) => (
  <S.MainDescriptionAttachment>
    <S.DescriptionAttachmentTitle>
      {
        attachment.length === 0
          ? 'No Attachment' : 'Attachment'
      }
    </S.DescriptionAttachmentTitle>
    {
      attachment.length === 0 ? null : (
        <S.DescriptionAttachmentsList>
          {
            attachment.map((item, index) => (
              <S.DescriptionAttachmentItem
                onClick={() => showAttachmentWindow(index)}
                key={item.id}
              >
                <S.Item>
                  {
                    item.mimeType.indexOf('application')
                      ? (
                        <S.ItemImage
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

                  <S.AttachmentDescription>
                    {item.filename}
                  </S.AttachmentDescription>
                  <S.Info>
                    <S.DateAttachment>
                      {item.created}
                    </S.DateAttachment>
                    <S.SizeAttachment>
                      {item.size}
                    </S.SizeAttachment>
                  </S.Info>
                </S.Item>
              </S.DescriptionAttachmentItem>
            ))
          }
        </S.DescriptionAttachmentsList>
      )
    }
  </S.MainDescriptionAttachment>
);

export default DescriptionSectionAttachment;
