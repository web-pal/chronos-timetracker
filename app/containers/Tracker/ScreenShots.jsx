import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import Slider from 'react-slick';


const settings = {
  className: 'center',
  centerMode: true,
  infinite: true,
  centerPadding: '60px',
  slidesToShow: 3,
  speed: 500,
};

const ScreenShots = ({ screenshots }) =>
  <div>
    <Slider {...settings}>
      <div><h3>1</h3></div>
      <div><h3>2</h3></div>
      <div><h3>3</h3></div>
      <div><h3>4</h3></div>
      <div><h3>5</h3></div>
      <div><h3>6</h3></div>
      <div><h3>7</h3></div>
      <div><h3>8</h3></div>
      <div><h3>9</h3></div>
    </Slider>
  </div>;

ScreenShots.propTypes = {
  screenshots: ImmutablePropTypes.orderedSet.isRequired,
};

function mapStateToProps({ issues }) {
  return {
    screenshots: issues.meta.currentScreenshots,
  };
}

export default connect(mapStateToProps)(ScreenShots);
