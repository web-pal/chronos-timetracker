// @flow
import React, { Component } from 'react';
import { remote, ipcRenderer } from 'electron';
import { Button } from 'styles/buttons';
import { Img, Flex } from 'components';

import PopupTimer from './PopupTimer';
import '../../../assets/stylesheets/main.less';

const { getGlobal } = remote;
let acceptLock = false;

type State = {
  maxTime: number,
  currentTime: number,
  lastScreenshotPath: string,
}

export default class ScreenPopup extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    const { lastScreenshotPath, screenshotPreviewTime } = getGlobal('sharedObj');
    remote.getCurrentWindow().flashFrame(true);
    this.state = {
      maxTime: screenshotPreviewTime,
      currentTime: 0,
      lastScreenshotPath,
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => this.tick(), 1000);
  }

  timer = 0;

  tick = () => {
    const { maxTime, currentTime } = this.state;
    if (currentTime < maxTime) {
      this.setState({
        currentTime: this.state.currentTime + 1,
      });
    } else {
      clearInterval(this.timer);
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
      <Flex row justifyCenter className="popup">
        <Flex column>
          <Img src={lastScreenshotPath} className="screenshot-preview" />
          <PopupTimer time={maxTime - currentTime} />
          <Flex row justifyCenter>
            <Button
              background="hsla(40, 100%, 45%, 1)"
              style={{ marginRight: 5, width: 90 }}
              onClick={this.rejectScreenshot}
            >
              Reject
            </Button>
            <Button
              background="#36B37E"
              style={{ width: 90 }}
              onClick={this.acceptScreenshot}
            >
              Accept
            </Button>
          </Flex>
        </Flex>
      </Flex>
    );
  }
}
