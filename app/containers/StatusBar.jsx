import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Flex from '../components/Base/Flex/Flex';
import Updater from './Updater';

const StatusBar = ({ online }) =>
  <Flex row className="StatusBar">
    <Updater />
    <div className="Connection section">
      <a
        title={`${online ? 'Connected to internet' : 'No internet connection'}`}
      >
        <span className={`fa fa-bolt ${online ? 'online' : 'offline'}`} />
      </a>
    </div>
  </Flex>;

StatusBar.propTypes = {
  online: PropTypes.bool.isRequired,
};

function mapStateToProps({ jira }) {
  return {
    online: jira.online
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusBar);
