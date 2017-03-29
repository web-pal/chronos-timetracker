import React, { PropTypes, Component } from 'react';
import { remote, ipcRenderer } from 'electron';


class Updater extends Component {
  static propTypes = {
    showLoading: PropTypes.func.isRequired,
    hideLoading: PropTypes.func.isRequired,
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
    this.electronUpdater = remote.require('electron-simple-updater');

    this.electronUpdater.on('checking-for-update', this.onCheckingForUpdate);
    this.electronUpdater.on('update-available', this.onUpdateAvailable);
    this.electronUpdater.on('update-downloading', this.onUpdateDownloading);
    this.electronUpdater.on('update-downloaded', this.onUpdateDownloaded);
    this.electronUpdater.checkForUpdates();
  }

  componentWillUnmount() {
    this.electronUpdater.removeAllListeners();
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
    setTimeout(() => {
      if (window.confirm('App updated, restart now?')) {
        ipcRenderer.send('set-should-quit');
        this.electronUpdater.quitAndInstall();
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

  installUpdates = () => this.electronUpdater.downloadUpdate();

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

export default Updater;
