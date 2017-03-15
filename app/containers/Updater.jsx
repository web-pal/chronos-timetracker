import React, { PropTypes, Component } from 'react';
import { remote, ipcRenderer } from 'electron';
import LoadingBar from '../components/LoadingBar/LoadingBar';

import Flex from '../components/Base/Flex/Flex';


class Updater extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checking: false,
      downloading: false,
      available: false,
      updateAvailable: null,
    }
  }

  componentWillMount() {
    this.electronUpdater = remote.require('electron-simple-updater');
    this.electronUpdater.on('checking-for-update', () => {
      this.setUpdateFetchState(true);
    });

    this.electronUpdater.on('update-available', (meta) => {
      this.setUpdateFetchState(false);
      this.notifyUpdateAvailable(meta);
    });

    this.electronUpdater.on('update-downloading', () => {
      this.props.showLoading();
      this.setUpdateDownloadState(true);
    });

    this.electronUpdater.on('update-downloaded', () => {
      this.props.hideLoading();
      setTimeout(() => {
        if (window.confirm('App updated, restart now?')) {
          ipcRenderer.send('set-should-quit');
          this.electronUpdater.quitAndInstall();
        }
      }, 500);
    });
    this.electronUpdater.checkForUpdates();
  }

  setUpdateDownloadState = value => {
    this.setState({
      downloading: value,
    });
  }

  setUpdateFetchState = value => {
    this.setState({
      checking: value,
    });
  }

  notifyUpdateAvailable = meta => {
    this.setState({
      available: true,
      updateAvailable: meta,
    });
  }

  componentWillUnmount() {
    this.electronUpdater.removeAllListeners();
  }

  installUpdates = () => this.electronUpdater.downloadUpdate();

  render() {
    const { checking, downloading, available, updateAvailable } = this.state;
    return (
      <div className="Updater section">
        <div className="UpdaterAvailable">
          <a title={`${!available ? 'latest version' : 'update available'}`}>
            <span className={`fa fa-code-fork ${available ? 'available' : 'latest'}`} />
          </a>
          <span>
          </span>
          {(available && !downloading) &&
            <span className="flex-item--center">
              ({updateAvailable.version}) is out!
              <a onClick={this.installUpdates} style={{ cursor: 'pointer'}}>
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
