import React from 'react';
import rightArrow from 'images/rigth-arrow.png';
import leftArrow from 'images/left-arrow.png';
import DownloadIcon from '@atlaskit/icon/glyph/download';
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

import AttachmentsList from './AttachmentsList/AttachmentsList';


class AttachmentPopupComponent extends React.PureComponent {
  state = {
    zoom: 1,
  };

  render() {
    const {
      attachmentItem,
      prevAttachment,
      nextAttachment,
      activeIndex,
      attachmentSize,
      selectAttachment,
      attachment,
    } = this.props;

    const { zoom } = this.state;

    return (
      <MainAttachmentContainer>
        <HeaderContainer>
          <TitleContainer>
            <TitleText>
              {attachmentItem.filename}
            </TitleText>
          </TitleContainer>
          <DownloadButtonContainer>
            <DownloadButton
              href={attachmentItem.content}
              download={attachmentItem.filename}
            >
              <DownloadIcon />
            </DownloadButton>
          </DownloadButtonContainer>
        </HeaderContainer>
        <MainContentContainer>
          <LeftButtonContainer>
            <LeftButton
              onClick={prevAttachment}
              disabled={activeIndex === 0}
            >
              <Arrow
                src={leftArrow}
                alt="arrow"
              />
            </LeftButton>
          </LeftButtonContainer>
          <MainImageContainer>
            {
              /(jpeg|jpg|png|svg)/.test(attachmentItem.mimeType)
                ? (
                  <AttachmentImage
                    src={attachmentItem.content}
                    zoom={zoom}
                    onClick={() => this.setState(({ zoom }) => ({
                      zoom: zoom === 4 ? 1 : zoom + 1,
                    }))}
                    alt="image"
                  />
                )
                : (
                  <DownloadAttachment
                    attachment={attachmentItem}
                  />
                )
            }
          </MainImageContainer>
          <RightButtonContainer>
            <RightButton
              onClick={nextAttachment}
              disabled={attachmentSize - 1 === activeIndex}
            >
              <Arrow
                src={rightArrow}
                alt="arrow"
              />
            </RightButton>
          </RightButtonContainer>
        </MainContentContainer>
        <AttachmentsList
          selectAttachment={selectAttachment}
          attachment={attachment}
        />
      </MainAttachmentContainer>
    );
  }
}


export default AttachmentPopupComponent;
