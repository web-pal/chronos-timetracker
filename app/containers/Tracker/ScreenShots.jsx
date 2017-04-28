import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

const ScreenShots = ({ screenshots }) =>
  <div>
    {screenshots.map(item =>
      <div key={item.timestamp}>
        <div>{item.screenshot}</div>
        <div>{item.screenshotTime}</div>
      </div>
    )}
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
