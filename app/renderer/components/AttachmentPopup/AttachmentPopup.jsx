import React from 'react';
import rightArrow from 'images/rigth-arrow.png';
import leftArrow from 'images/left-arrow.png';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import DownloadAttachment from 'components/AttachmentPopup/DownloadAttachment';
import * as S from './styled';

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
      <S.MainAttachment>
        <S.Header>
          <S.Title>
            <S.TitleText>
              {attachmentItem.filename}
            </S.TitleText>
          </S.Title>
          <S.MainDownloadButton>
            <S.DownloadButton
              href={attachmentItem.content}
              download={attachmentItem.filename}
            >
              <DownloadIcon />
            </S.DownloadButton>
          </S.MainDownloadButton>
        </S.Header>
        <S.MainContent>
          <S.LeftButton>
            <S.LeftButtonView
              onClick={prevAttachment}
              disabled={activeIndex === 0}
            >
              <S.Arrow
                src={leftArrow}
                alt="arrow"
              />
            </S.LeftButtonView>
          </S.LeftButton>
          <S.MainImage>
            {
              /(jpeg|jpg|png|svg)/.test(attachmentItem.mimeType)
                ? (
                  <S.AttachmentImage
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
          </S.MainImage>
          <S.RightButton>
            <S.RightButtonView
              onClick={nextAttachment}
              disabled={attachmentSize - 1 === activeIndex}
            >
              <S.Arrow
                src={rightArrow}
                alt="arrow"
              />
            </S.RightButtonView>
          </S.RightButton>
        </S.MainContent>
        <AttachmentsList
          selectAttachment={selectAttachment}
          attachment={attachment}
        />
      </S.MainAttachment>
    );
  }
}


export default AttachmentPopupComponent;
