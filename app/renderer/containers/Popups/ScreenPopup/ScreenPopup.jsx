// @flow
import React, { Component } from 'react';
import {
  remote,
  ipcRenderer,
} from 'electron';

import {
  Flex,
} from 'components';

import {
  Button,
} from 'styles/buttons';
import {
  PopupContainer,
  PopupImage,
} from './styled';
import '../../../assets/stylesheets/main.less';

const {
  getGlobal,
} = remote;
let acceptLock = false;

type State = {
  maxTime: number,
  currentTime: number,
  lastScreenshotPath: string,
}

export default class ScreenPopup extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    const {
      lastScreenshotPath,
      screenshotPreviewTime,
    } = getGlobal('sharedObj');
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

  timer: IntervalID;

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
      <PopupContainer>
        <Flex column>
          <PopupImage src={lastScreenshotPath} />
          <Flex row justifyCenter style={{ fontSize: '1.5em' }}>
            {maxTime - currentTime}
          </Flex>
          <Flex row justifyCenter>
            <Button
              background="hsla(40, 100%, 45%, 1)"
              style={{
                marginRight: 5,
                width: 90,
                lineHeight: '16px',
                borderRadius: 2,
              }}
              onClick={this.rejectScreenshot}
            >
              Reject
            </Button>
            <Button
              background="#36B37E"
              style={{ width: 90, lineHeight: '16px', borderRadius: 2 }}
              onClick={this.acceptScreenshot}
            >
              Accept
            </Button>
          </Flex>
        </Flex>
      </PopupContainer>
    );
  }
}
