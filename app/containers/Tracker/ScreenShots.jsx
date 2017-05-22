import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import Slider from 'react-slick';


const settings = {
  className: 'center',
  centerMode: true,
  infinite: true,
  centerPadding: '0px',
  slidesToShow: 7,
  speed: 500,
};

const ScreenShots = ({ screenshots }) =>
  <div>
    <Slider {...settings}>
      <div>
        <img className="slider-image" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMlVu-ORUJG44NtYyXam7_78CRuAeXHfw5UUD-dNV-24qoP1udh22r49Gt" alt="alt" />
        <div className="slider-timestamp">{new Date().toDateString().toString()}</div>
      </div>
      <div>
        <img className="slider-image" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMlVu-ORUJG44NtYyXam7_78CRuAeXHfw5UUD-dNV-24qoP1udh22r49Gt" alt="alt" />
        <div className="slider-timestamp">{new Date().toDateString().toString()}</div>
      </div>
      <div>
        <img className="slider-image" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMlVu-ORUJG44NtYyXam7_78CRuAeXHfw5UUD-dNV-24qoP1udh22r49Gt" alt="alt" />
        <div className="slider-timestamp">{new Date().toDateString().toString()}</div>
      </div>
      <div>
        <img className="slider-image" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMlVu-ORUJG44NtYyXam7_78CRuAeXHfw5UUD-dNV-24qoP1udh22r49Gt" alt="alt" />
        <div className="slider-timestamp">{new Date().toDateString().toString()}</div>
      </div>
      <div>
        <img className="slider-image" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMlVu-ORUJG44NtYyXam7_78CRuAeXHfw5UUD-dNV-24qoP1udh22r49Gt" alt="alt" />
        <div className="slider-timestamp">{new Date().toDateString().toString()}</div>
      </div>
      <div>
        <img className="slider-image" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMlVu-ORUJG44NtYyXam7_78CRuAeXHfw5UUD-dNV-24qoP1udh22r49Gt" alt="alt" />
        <div className="slider-timestamp">{new Date().toDateString().toString()}</div>
      </div>
      <div>
        <img className="slider-image" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMlVu-ORUJG44NtYyXam7_78CRuAeXHfw5UUD-dNV-24qoP1udh22r49Gt" alt="alt" />
        <div className="slider-timestamp">{new Date().toDateString().toString()}</div>
      </div>
      <div>
        <img className="slider-image" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMlVu-ORUJG44NtYyXam7_78CRuAeXHfw5UUD-dNV-24qoP1udh22r49Gt" alt="alt" />
        <div className="slider-timestamp">{new Date().toDateString().toString()}</div>
      </div>
      <div>
        <img className="slider-image" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMlVu-ORUJG44NtYyXam7_78CRuAeXHfw5UUD-dNV-24qoP1udh22r49Gt" alt="alt" />
        <div className="slider-timestamp">{new Date().toDateString().toString()}</div>
      </div>
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
