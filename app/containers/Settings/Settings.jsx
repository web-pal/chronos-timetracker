import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'react-modal';
import ImmutablePropTypes from 'react-immutable-proptypes';

import * as uiActions from '../../actions/ui';
import Flex from '../../components/Base/Flex/Flex';

class Settings extends Component {
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
          <Flex row centered className="Settings">
            <span className="fa fa-times Settings__close-btn" onClick={this.handleClose} />
            <Flex column className="Settings__inner-wrapper">
              <Flex row centered className="Settings__header">
                <h2>Preferences</h2>
              </Flex>
              <Flex row className="Settings__body">
                <Flex column>
                  <div className="form-group">
                    <input
                      name="showScreenshotPreview"
                      id="showPreview"
                      type="checkbox"
                      checked={settings.get('showScreenshotPreview')}
                      onChange={
                        ev => setLocalDesktopSettings('showScreenshotPreview', ev.target.checked)
                      }
                    />
                    <label htmlFor="showPreview">
                      Screenshot preview
                    </label>
                  </div>
                  {settings.get('showScreenshotPreview') &&
                    <div>
                      <div className="subInputs">
                        <div className="form-group">
                          <input
                            name="previewTime"
                            id="5s"
                            type="radio"
                            checked={settings.get('screenshotPreviewTime') === 5}
                            onChange={this.setScreenshotPreviewTime(5)}
                          />
                          <label htmlFor="5s">
                            5 seconds
                          </label>
                        </div>
                        <div className="form-group">
                          <input
                            name="previewTime"
                            id="10s"
                            type="radio"
                            checked={settings.get('screenshotPreviewTime') === 10}
                            onChange={this.setScreenshotPreviewTime(10)}
                          />
                          <label htmlFor="10s">
                            10 seconds
                          </label>
                        </div>
                        <div className="form-group">
                          <input
                            name="previewTime"
                            id="15s"
                            type="radio"
                            checked={settings.get('screenshotPreviewTime') === 15}
                            onChange={this.setScreenshotPreviewTime(15)}
                          />
                          <label htmlFor="15s">
                            15 seconds
                          </label>
                        </div>
                      </div>
                      {process.platform === 'darwin' &&
                        <div>
                          <div className="form-group">
                            <input
                              name="nativeNotifications"
                              id="useNative"
                              type="radio"
                              checked={settings.get('nativeNotifications')}
                              onChange={this.setNativeNotificationsSettings(true)}
                            />
                            <label htmlFor="useNative">
                              Use native notifications
                            </label>
                          </div>
                          <div className="form-group">
                            <input
                              name="nativeNotifications"
                              id="usPopup"
                              type="radio"
                              checked={!settings.get('nativeNotifications')}
                              onChange={this.setNativeNotificationsSettings(false)}
                            />
                            <label htmlFor="usePopup">
                              Use popup notifications
                            </label>
                          </div>
                        </div>
                      }
                    </div>
                  }
                </Flex>
              </Flex>
            </Flex>
          </Flex>
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

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
