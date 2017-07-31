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
    setShowSettingsModal: PropTypes.func.isRequired,
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
      sharedObj.showTimer = value;
      this.props.setLocalDesktopSettings('trayShowTimer', value);
    }
  }

  handleClose = () => {
    this.props.setShowSettingsModal(false);
  }

  render() {
    const { showModal, settings, setLocalDesktopSettings } = this.props;
    return (
      <div className="SettingsWrapper">
        <Modal
          isOpen={showModal}
          contentLabel="Settings modal"
          onRequestClose={this.handleClose}
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

function mapStateToProps({ ui, settings }) {
  return {
    showModal: ui.showSettingsModal,
    settings: settings.localDesktopSettings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...uiActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsModal);
