import React, { Component } from 'react';
import { remote, ipcRenderer } from 'electron';

import Img from '../../Base/Img/Img';
import Flex from '../../Base/Flex/Flex';
import PopupTimer from '../../PopupTimer/PopupTimer';

import {} from './styled';
import { Button } from '../../../styles/buttons';

import '../../../assets/stylesheets/main.less';

const { getGlobal } = remote;
let acceptLock = false;


export default class ScreenPopup extends Component {
  constructor(props) {
    super(props);
    const { lastScreenshotPath, screenshotTime, screenshotPreviewTime } = getGlobal('sharedObj');
    remote.getCurrentWindow().flashFrame(true);
    this.state = {
      maxTime: screenshotPreviewTime,
      currentTime: 0,
      lastScreenshotPath,
      screenshotTime,
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => this.tick(), 1000);
  }

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
      <Flex row centered className="popup">
        <Flex column>
          <Img src={lastScreenshotPath} className="screenshot-preview" />
          <PopupTimer time={maxTime - currentTime} />
          <Flex row centered>
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
