import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import trashIcon from '../../assets/images/trash-icon.png';
import screenshotDeletedIcon from '../../assets/images/screenshot-deleted.png';
import { stj } from 'time-util';

import Flex from '../Base/Flex/Flex';

function imageSorter(a, b) {
  return a.screenshotTime > b.screenshotTime;
}

const Gallery = ({ images, deleteScreenshot }) =>
  <Flex column className="gallery-wrapper">
    {images.size > 0 &&
      <h2 className="gallery__header">Screenshots</h2>
    }
    <Flex row className="gallery">
      {images.sort(imageSorter).map(image =>
        <Flex
          key={image.screenshotTime}
          column
          className={`gallery__screenshot ${image.isDeleted ? 'gallery__screenshot_deleted' : ''}`}
        >
          {image.isDeleted
            ? <img src={screenshotDeletedIcon} className="screenshotDeletedIcon" />
            : [
              <img src={image.screenshot} className="gallery__image" />,
              <img
                src={trashIcon}
                className="trashIcon"
                onClick={() => deleteScreenshot(image)}
              />
            ]
          }
          <span className="gallery__timestamp">
            @ {stj(image.screenshotTime, 'm[m] s[s]')}
          </span>
        </Flex>
      )}
    </Flex>
  </Flex>; 

Gallery.propTypes = {
  images: PropTypes.object.isRequired,
  deleteScreenshot: PropTypes.func.isRequired,
};

export default Gallery;
