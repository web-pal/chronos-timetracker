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
    this.electronUpdater.on('cheking-for-update', () => {
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
      if(window.confirm('App updated, restart now?')) {
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

  installUpdates = () => this.electronUpdater.downloadUpdate(); 

  render() {
    const { checking, downloading, available, updateAvailable } = this.state;
    return (
      <Flex row className="Updater">
        {checking &&
          <Flex row className="UpdaterChecking">
            <span className="flex-item--center">
              Checking for updates
            </span>
            <Pace color="#5454ee" height={20} />
          </Flex>
        }
        {!downloading && available &&
          <Flex row className="UpdaterAvailable">
            <span className="flex-item--center">
              New version is available ({updateAvailable.version})
              <a onClick={this.installUpdates}>&nbsp;install</a>
            </span>
          </Flex>
        }
        {downloading &&
          <Flex row className="flex-item--end UpdaterDownloading">
            <span className="flex-item--center">
              Downloading update
            </span>
            <Pace color="#5454ee" height={20} />
            {performance.getEntriesByType('resources').map(item => <span>{item}</span>)}
          </Flex>
        }
      </Flex>
    );
  }
}
