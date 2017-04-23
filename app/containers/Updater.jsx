import React, { PropTypes, Component } from 'react';
import { remote, ipcRenderer } from 'electron';
import { checkUpdates } from 'config';

const { autoUpdater } = remote.require('electron-updater');
autoUpdater.requestHeaders = { 'Cache-Control': 'no-cache' };
autoUpdater.autoDownload = false;

class UpdaterContainer extends Component {
  static propTypes = {
    showLoading: PropTypes.func.isRequired,
    hideLoading: PropTypes.func.isRequired,
    setForceQuitFlag: PropTypes.func.isRequired,
    stopTimer: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      checking: false,
      downloading: false,
      available: false,
      updateAvailable: null,
    };
  }

  componentDidMount() {
    autoUpdater.on('checking-for-update', this.onCheckingForUpdate);
    autoUpdater.on('update-available', this.onUpdateAvailable);
    autoUpdater.on('update-downloaded', this.onUpdateDownloaded);
    if (checkUpdates) {
      autoUpdater.checkForUpdates();
    }
  }

  componentWillUnmount() {
    autoUpdater.removeAllListeners();
  }

  onCheckingForUpdate = () => {
    this.setUpdateFetchState(true);
  }

  onUpdateAvailable = (meta) => {
    this.setUpdateFetchState(false);
    this.notifyUpdateAvailable(meta);
  }

  onUpdateDownloaded = () => {
    this.props.hideLoading();
    const { getGlobal } = remote;
    setTimeout(() => {
      if (window.confirm('App updated, restart now?')) {
        const { running, uploading } = getGlobal('sharedObj');
        if (uploading) {
          window.alert('Currently app in process of saving worklog, wait few seconds and restart app');
        } else {
          if (running) { // eslint-disable-line
            if (window.confirm('Tracking in progress, save worklog before restart?')) {
              this.props.setForceQuitFlag(autoUpdater.quitAndInstall);
              this.props.stopTimer();
            }
          } else {
            ipcRenderer.send('set-should-quit');
            autoUpdater.quitAndInstall();
          }
        }
      }
    }, 500);
  }

  setUpdateDownloadState = (value) => {
    this.setState({
      downloading: value,
    });
  }

  setUpdateFetchState = (value) => {
    this.setState({
      checking: value,
    });
  }

  notifyUpdateAvailable = (meta) => {
    this.setState({
      available: true,
      updateAvailable: meta,
    });
  }

  installUpdates = () => {
    autoUpdater.downloadUpdate();
    this.props.showLoading();
    this.setUpdateDownloadState(true);
  }

  render() {
    const { downloading, available, updateAvailable } = this.state;
    return (
      <div className="Updater section">
        <div className="UpdaterAvailable">
          <a title={`${!available ? 'latest version' : 'update available'}`}>
            <span className={`fa fa-code-fork ${available ? 'available' : 'latest'}`} />
          </a>
          <span />
          {(available && !downloading) &&
            <span className="flex-item--center">
              ({updateAvailable.version}) is out!
              <a onClick={this.installUpdates} style={{ cursor: 'pointer' }}>
                &nbsp;update
              </a>
            </span>
          }
        </div>
      </div>
    );
  }
}

export default UpdaterContainer;
