import React, { PropTypes, Component } from 'react';
import { remote } from 'electron';
import Pace from 'react-pace-progress';

import Flex from '../components/Base/Flex/Flex';
import Spinner from '../components/Spinners/FloatingCircles';

export default class Updater extends Component {
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
      this.setUpdateDownloadState(true);
    });

    this.electronUpdater.on('update-downloaded', () => {
      this.setUpdateDownloadState(false);
      if (window.confirm('App updated, restart now?')) {
        this.electronUpdater.quitAndInstall();
      }
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
            {available &&
              <span className="flex-item--center">
                ({updateAvailable.version}) is out! <a onClick={this.installUpdates}>&nbsp;update</a>
              </span>
            }
          </div>
        {downloading &&
          <Flex row className="flex-item--end UpdaterDownloading">
            <span className="flex-item--center">
              Downloading update
            </span>
            <Pace color="#5454ee" height={20} />
          </Flex>
        }
      </div>
    );
  }
}
