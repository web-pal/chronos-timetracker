import React, { Component } from 'react';
import { remote, ipcRenderer } from 'electron';
import fs from 'fs';
import path from 'path';

import Img from '../components/Base/Img/Img';
import Flex from '../components/Base/Flex/Flex';
import PopupTimer from '../components/PopupTimer/PopupTimer';

import '../assets/stylesheets/main.less';

const { getGlobal } = remote;
let acceptLock = false;


export default class Popup extends Component {
  constructor(props) {
    super(props);
    const { lastScreenshotPath, screenshotTime, currentWorklogId } = getGlobal('sharedObj');
    remote.getCurrentWindow().flashFrame(true);
    this.state = {
      maxTime: 15,
      currentTime: 0,
      lastScreenshotPath,
      screenshotTime,
      currentWorklogId,
    };
  }

  componentWillMount() {
    const timer = setInterval(() => this.tick(), 1000);
    this.setState({
      timer,
    });
  }

  tick = () => {
    const { maxTime, currentTime } = this.state;
    if (currentTime < maxTime) {
      this.setState({
        currentTime: this.state.currentTime + 1,
      });
    } else {
      clearInterval(this.state.timer);
      this.acceptScreenshot();
    }
  }

  acceptScreenshot = () => {
    if (!acceptLock) {
      acceptLock = true;
      ipcRenderer.send('screenshot-accept');
      remote.getCurrentWindow().destroy();
    }
  }

  rejectScreenshot = () => {
    ipcRenderer.send('screenshot-reject');
    remote.getCurrentWindow().destroy();
  }

  render() {
    const { lastScreenshotPath, currentTime, maxTime } = this.state;
    return (
      <Flex row centered className="popup">
        <Flex column>
          <Img src={lastScreenshotPath} className="screenshot-preview" />
          <PopupTimer time={maxTime - currentTime} />
          <Flex row centered>
            <button
              className="button button-info"
              onClick={this.acceptScreenshot}
            >
              Accept
            </button>
            <button
              className="button button-primary"
              onClick={this.rejectScreenshot}
            >
              Reject
            </button>
          </Flex>
        </Flex>
      </Flex>
    );
  }
}
