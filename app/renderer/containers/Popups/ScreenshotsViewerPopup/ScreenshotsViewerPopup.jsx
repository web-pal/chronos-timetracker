import React from 'react';
import PropTypes from 'prop-types';
import {
  connect,
} from 'react-redux';

import {
  getActivityForScreenshotsViewer,
} from 'selectors';

import Spinner from '@atlaskit/spinner';
import {
  Flex,
} from 'styles';

import ActivityReport from './ActivityReport';


const ScreenshotsViewerPopup = ({ activity }) => (
  activity.length
    ? (
      <Flex
        fillSpace
        scroll
      >
        <Flex
          column
          width="100%"
          spacing={16}
        >
          {activity.map(
            a => (
              <ActivityReport
                key={a.id}
                activity={a}
              />
            ),
          )}
        </Flex>
      </Flex>
    ) : (
      <Flex
        column
        width="100%"
        height="100%"
        align="center"
        justify="center"
      >
        <Spinner size="xlarge" />
      </Flex>
    )
);

ScreenshotsViewerPopup.propTypes = {
  activity: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
  return {
    activity: getActivityForScreenshotsViewer(state),
  };
}

const connector = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(ScreenshotsViewerPopup);
