import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'react-modal';
import ImmutablePropTypes from 'react-immutable-proptypes';

import * as uiActions from '../../actions/ui';


class Modals extends Component {
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


  render() {
    const { showModal, settings, setShowSettingsModal, setLocalDesktopSettings } = this.props;
    return (
      <div>
        <Modal isOpen={showModal} contentLabel="Settings modal">
          <h2>Hello</h2>
          <button onClick={() => setShowSettingsModal(false)}>close</button>
          <div>
            Screenshot preview
            <input
              type="checkbox"
              checked={settings.get('showScreenshotPreview')}
              onChange={
                ev => setLocalDesktopSettings('showScreenshotPreview', ev.target.checked)
              }
            />
          </div>
          {settings.get('showScreenshotPreview') &&
            <div>
              <div>
                5 seconds
                <input
                  name="previewTime"
                  type="radio"
                  checked={settings.get('screenshotPreviewTime') === 5}
                  onChange={this.setScreenshotPreviewTime(5)}
                />
              </div>
              <div>
                10 seconds
                <input
                  name="previewTime"
                  type="radio"
                  checked={settings.get('screenshotPreviewTime') === 10}
                  onChange={this.setScreenshotPreviewTime(10)}
                />
              </div>
              <div>
                15 seconds
                <input
                  name="previewTime"
                  type="radio"
                  checked={settings.get('screenshotPreviewTime') === 15}
                  onChange={this.setScreenshotPreviewTime(15)}
                />
              </div>
            </div>
          }
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

export default connect(mapStateToProps, mapDispatchToProps)(Modals);
