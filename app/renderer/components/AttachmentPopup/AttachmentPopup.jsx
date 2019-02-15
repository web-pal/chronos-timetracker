import React from 'react';
import rightArrow from 'images/rigth-arrow.png';
import leftArrow from 'images/left-arrow.png';
import downloadButtonIcon from 'images/download_icon.png';
import DownloadAttachment from 'components/AttachmentPopup/DownloadAttachment';
import {
  MainAttachmentContainer,
  HeaderContainer,
  DownloadButtonContainer,
  TitleContainer,
  TitleText,
  DownloadButton,
  DownloadButtonIcon,
  MainContentContainer,
  RightButtonContainer,
  MainImageContainer,
  LeftButtonContainer,
  AttachmentImage,
  RightButton,
  LeftButton,
  Arrow,
} from './styled/index';

import ShowAllAttachment from './ShowAllAttachment/ShowAllAttachment';


const AttachmentPopupComponent = ({ ...props }) => (
  <MainAttachmentContainer>
    <HeaderContainer>
      <TitleContainer>
        <TitleText>
          {props.attachmentItem.filename}
        </TitleText>
      </TitleContainer>
      <DownloadButtonContainer>
        <DownloadButton
          href={props.attachmentItem.content}
          download={props.attachmentItem.filename}
        >
          <DownloadButtonIcon
            src={downloadButtonIcon}
            alt="downloadIcon"
          />
        </DownloadButton>
      </DownloadButtonContainer>
    </HeaderContainer>
    <MainContentContainer>
      <LeftButtonContainer>
        <LeftButton
          onClick={props.prevAttachment}
          disabled={props.activeIndex === 0}
        >
          <Arrow
            src={leftArrow}
            alt="arrow"
          />
        </LeftButton>
      </LeftButtonContainer>
      <MainImageContainer>
        {
          props.attachmentItem.mimeType.indexOf('application')
            ? (
              <AttachmentImage
                src={props.attachmentItem.content}
                alt="image"
              />
            )
            : (
              <DownloadAttachment
                attachment={props.attachmentItem}
              />
            )
        }
      </MainImageContainer>
      <RightButtonContainer>
        <RightButton
          onClick={props.nextAttachment}
          disabled={props.attachmentSize - 1 === props.activeIndex}
        >
          <Arrow
            src={rightArrow}
            alt="arrow"
          />
        </RightButton>
      </RightButtonContainer>
    </MainContentContainer>
    <ShowAllAttachment
      selectAttachment={props.selectAttachment}
      attachment={props.attachment}
    />
  </MainAttachmentContainer>
);


export default AttachmentPopupComponent;
