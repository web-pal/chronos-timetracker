import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Flex from '../../components/Base/Flex/Flex';
import LoadingBar from '../../components/LoadingBar/LoadingBar';
import Updater from './../Updater';

import * as loadingBarActions from '../../actions/loadingBar';
import * as timerActions from '../../actions/timer';


const StatusBar = ({ showLoading, hideLoading, setForceQuitFlag, stopTimer }) =>
  <Flex row className="StatusBar">
    <div style={{ flexGrow: '1' }}>
      <LoadingBar
        infinite
        maxProgress={100}
        progressIncrease={2}
        updateTime={800}
        style={{ backgroundColor: '#5454ee', marginTop: '20px' }}
      />
    </div>
    <Updater
      showLoading={showLoading}
      hideLoading={hideLoading}
      setForceQuitFlag={setForceQuitFlag}
      stopTimer={stopTimer}
    />
  </Flex>;

StatusBar.propTypes = {
  showLoading: PropTypes.func.isRequired,
  hideLoading: PropTypes.func.isRequired,
  setForceQuitFlag: PropTypes.func.isRequired,
  stopTimer: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...loadingBarActions, ...timerActions }, dispatch);
}

export default connect(null, mapDispatchToProps)(StatusBar);
