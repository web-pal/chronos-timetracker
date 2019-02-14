import React from 'react';
import {
  ShowAllContainer,
  ItemContainer,
  Item,
  ItemImageContainer,
  ItemImage,
  DescriptionImage,
} from './styled';

import DownloadAttachment from '../DownloadAttachment/DownloadAttachment';

const ShowAllAttachment = ({ attachment, selectAttachment }) => (
  <ShowAllContainer>
    <ItemContainer>
      {
        attachment.map((item, index) => (
          <Item key={item.id}>
            <ItemImageContainer
              onClick={() => selectAttachment(index)}
            >
              {
                item.mimeType.indexOf('application')
                  ? (
                    <ItemImage
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
              <DescriptionImage>
                {item.filename}
              </DescriptionImage>
            </ItemImageContainer>
          </Item>
        ))
      }
    </ItemContainer>
  </ShowAllContainer>
);

export default ShowAllAttachment;
