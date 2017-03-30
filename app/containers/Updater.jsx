import React, { PropTypes, Component } from 'react';
import { remote, ipcRenderer } from 'electron';

const Updater = remote.require('electron-simple-updater');


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
    Updater.on('checking-for-update', this.onCheckingForUpdate);
    Updater.on('update-available', this.onUpdateAvailable);
    Updater.on('update-downloading', this.onUpdateDownloading);
    Updater.on('update-downloaded', this.onUpdateDownloaded);
    Updater.checkForUpdates();
  }

  componentWillUnmount() {
    Updater.removeAllListeners();
  }

  onCheckingForUpdate = () => {
    this.setUpdateFetchState(true);
  }

  onUpdateAvailable = (meta) => {
    this.setUpdateFetchState(false);
    this.notifyUpdateAvailable(meta);
  }

  onUpdateDownloading = () => {
    this.props.showLoading();
    this.setUpdateDownloadState(true);
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
              this.props.setForceQuitFlag(Updater.quitAndInstall);
              this.props.stopTimer();
            }
          } else {
            ipcRenderer.send('set-should-quit');
            Updater.quitAndInstall();
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

  installUpdates = () => Updater.downloadUpdate();

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
