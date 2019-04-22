import React from 'react';
import {
  connect,
} from 'react-redux';

import ScreenshotPopup from './ScreenshotPopup';

const ScreenshotNotificationPopup = ({ decisionTime }) => (
  decisionTime && (
    <ScreenshotPopup />
  )
);

function mapStateToProps(state) {
  return {
    decisionTime: state.screenshotNotificationReducer.decisionTime,
  };
}

const connector = connect(
  mapStateToProps,
);

export default connector(ScreenshotNotificationPopup);
