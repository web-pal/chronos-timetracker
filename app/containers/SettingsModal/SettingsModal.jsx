import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'react-modal';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { remote } from 'electron';

import * as uiActions from '../../actions/ui';
import Settings from '../../components/Settings/Settings';
import Flex from '../../components/Base/Flex/Flex';

const sharedObj = remote.getGlobal('sharedObj');

class SettingsModal extends Component {
  static propTypes = {
    showModal: PropTypes.bool.isRequired,
    settings: ImmutablePropTypes.map.isRequired,
    setShowAboutModal: PropTypes.func.isRequired,
    setLocalDesktopSettings: PropTypes.func.isRequired,
    getLocalDesktopSettings: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getLocalDesktopSettings();
  }

  setScreenshotPreviewTime = time => ev => {
    if (ev.target.checked) {
      this.props.setLocalDesktopSettings('screenshotPreviewTime', time);
    }
  }

  setNativeNotificationsSettings = value => ev => {
    if (ev.target.checked) {
      this.props.setLocalDesktopSettings('nativeNotifications', value);
    }
  }

  setTraySettings = value => ev => {
    if (ev.target.checked) {
      sharedObj.trayShowTimer = value;
      this.props.setLocalDesktopSettings('trayShowTimer', value);
    }
  }

  handleClose = () => {
    this.props.setShowAboutModal(false);
  }

  render() {
    const { showModal, settings, setLocalDesktopSettings } = this.props;
    return (
      <div className="SettingsWrapper" style={{ zIndex: 500 }}>
        <Modal
          isOpen={showModal}
          contentLabel="Settings modal"
          onRequestClose={this.handleClose}
          style={{ zIndex: 501 }}
        >
          <Settings
            onClose={this.handleClose}
            settings={settings}
            onScreenshotTimeChange={this.setScreenshotPreviewTime}
            onLocaDesktopSettingsChange={setLocalDesktopSettings}
            onNativeNotificationSettingsChange={this.setNativeNotificationsSettings}
            setTraySettings={this.setTraySettings}
          />
        </Modal>
      </div>
    );
  }
}

function mapStateToProps({ settings }) {
  return {
    showModal: true,
    settings: settings.localDesktopSettings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...uiActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsModal);
