import React from 'react';
import * as S from './styled';

import DownloadAttachment from '../DownloadAttachment/DownloadAttachment';

const AttachmentsList = ({ attachment, selectAttachment }) => (
  <S.ShowAll>
    <S.Item>
      {
        attachment.map((item, index) => (
          <S.ItemInside key={item.id}>
            <S.ItemImage
              onClick={() => selectAttachment(index)}
            >
              {
                item.mimeType.indexOf('application')
                  ? (
                    <S.Image
                      src={item.content}
                      alt="image"
                    />
                  )
                  : (
                    <DownloadAttachment
                      attachment={item}
                    />
                  )
              }
              <S.DescriptionImage>
                {item.filename}
              </S.DescriptionImage>
            </S.ItemImage>
          </S.ItemInside>
        ))
      }
    </S.Item>
  </S.ShowAll>
);

export default AttachmentsList;
