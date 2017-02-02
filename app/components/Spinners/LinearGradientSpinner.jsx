import React, { PropTypes } from 'react';

import Flex from '../Base/Flex/Flex';

const LinearGradientSpinner = ({ show, label, takeAllSpace, width, height }) => show &&
  <Flex
    column
    centered
    className="LinearGradientSpinnerWrap"
    style={{
      width: takeAllSpace ? '100%' : width,
      height: takeAllSpace ? '100%' : height,
    }}
  >
    <div className="LinearGradientSpinner" />
  </Flex>

LinearGradientSpinner.propTypes = {
  show: PropTypes.bool,
  takeAllSpace: PropTypes.bool,
  width: PropTypes.string,
  height: PropTypes.string,
  label: PropTypes.string,
};

export default LinearGradientSpinner;
