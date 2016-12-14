/* global document */
import React, { PropTypes } from 'react';

import Flex from '../Base/Flex/Flex';

const DescriptionPopup = ({ open, onClose, onConfirm }) => open &&
  <Flex row centered className="description-popup">
    <Flex column centered>
      <input
        type="text"
        placeholder="Briefly describe what you are doing"
        id="description"
      />
      <Flex row centered>
        <button
          className="button button-link"
          onClick={() => onConfirm(document.getElementById('description').value)}
        >
          Go!
        </button>
        <button
          className="button button-link button-danger"
          onClick={onClose}
        >
          Close
        </button>
      </Flex>
    </Flex>
  </Flex>;

DescriptionPopup.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default DescriptionPopup;
