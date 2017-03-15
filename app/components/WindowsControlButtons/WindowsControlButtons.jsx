import React, { PropTypes } from 'react';
import { ipcRenderer, remote } from 'electron';

import Flex from '../Base/Flex/Flex';

const { BrowserWindow } = remote;


function sendQuitSignal() {
  ipcRenderer.send('ready-to-quit');
}

function sendMinimizeSignal() {
  ipcRenderer.send('minimize');
}

function sendMaximizeSignal() {
  ipcRenderer.send('maximize');
}

function sendUnMaximizeSignal() {
  ipcRenderer.send('unmaximize');
}

const WindowsControlButtons = ({}) =>
  <Flex row className="WindowsControlButtons flex--end">
    <span
      className="fa fa-window-minimize"
      onClick={() => sendMinimizeSignal()}
    />&nbsp;
    {BrowserWindow.getAllWindows()[0].isMaximized()
      ? <span
        className="fa fa-window-unmaximize"
        onClick={() => sendUnMaximizeSignal()}
      />
      : <span
        className="fa fa-window-maximize"
        onClick={() => sendMaximizeSignal()}
      />
    }
    &nbsp;
    <span
      className="fa fa-window-close"
      onClick={() => sendQuitSignal()}
    />&nbsp;
  </Flex>;

WindowsControlButtons.propTypes = {

};

export default WindowsControlButtons;
