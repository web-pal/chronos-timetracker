import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Flex from '../../components/Base/Flex/Flex';
import LoadingBar from '../../components/LoadingBar/LoadingBar';
import Updater from './../Updater';

import * as loadingBarActions from '../../actions/loadingBar';


const StatusBar = ({ online, showLoading, hideLoading }) =>
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
    <Updater showLoading={showLoading} hideLoading={hideLoading} />
    <div className="Connection section">
      <a title={`${online ? 'Connected to internet' : 'No internet connection'}`} >
        <span className={`fa fa-bolt ${online ? 'online' : 'offline'}`} />
      </a>
    </div>
  </Flex>;

StatusBar.propTypes = {
  online: PropTypes.bool.isRequired,
  showLoading: PropTypes.func.isRequired,
  hideLoading: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return bindActionCreators(loadingBarActions, dispatch);
}

function mapStateToProps() {
  return {
    online: true,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusBar);
