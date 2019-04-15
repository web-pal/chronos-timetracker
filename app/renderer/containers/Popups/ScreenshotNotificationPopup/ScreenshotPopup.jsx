import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';
import {
  hot,
} from 'react-hot-loader/root';
import {
  connect,
} from 'react-redux';
import {
  remote,
} from 'electron';

import {
  screenshotsActions,
} from 'actions';

import Button, {
  ButtonGroup,
} from '@atlaskit/button';
import {
  Flex,
} from 'components';

import * as S from './styled';

class ScreenshotPopup extends Component {
  constructor(props) {
    super(props);
    remote.getCurrentWindow().flashFrame(true);
    const win = remote.getCurrentWindow();
    const { decisionTime } = this.props;
    this.state = {
      decisionTime,
      allowToResize: win.getSize()[0] === 360,
      currentTime: 0,
      isDismissed: false,
    };
  }

  componentDidMount() {
    if (!this.props.isTest) {
      this.timer = setInterval(() => this.tick(), 1000);
    }
  }

  tick = () => {
    const {
      decisionTime,
      currentTime,
      isDismissed,
    } = this.state;
    const { dispatch } = this.props;
    if (currentTime < decisionTime) {
      this.setState(state => ({
        currentTime: state.currentTime + 1,
      }));
    } else {
      clearInterval(this.timer);
      if (isDismissed) {
        dispatch(screenshotsActions.dismissTimeAndScreenshot());
      } else {
        dispatch(screenshotsActions.keepScreenshot());
      }
    }
  };

  render() {
    const {
      currentTime,
      decisionTime,
      isDismissed,
      allowToResize,
    } = this.state;
    const {
      screenshot,
      isTest,
      dispatch,
    } = this.props;

    return (
      <S.Popup>
        <Flex column>
          <S.PopupImage
            allowToResize={allowToResize}
            src={`file://${screenshot}`}
            onClick={() => {
              if (allowToResize) {
                const win = remote.getCurrentWindow();
                win.setBounds({
                  x: window.innerWidth,
                  y: 0,
                  width: 640,
                  height: 540,
                });
              }
            }}
          />
          <Flex row justifyCenter style={{ fontSize: '1.5em' }}>
            {isTest
              ? (
                <span>
                  Test screenshot
                </span>
              ) : (
                <span>
                  {decisionTime - currentTime}
                </span>
              )}
          </Flex>
          {isTest
            ? (
              <Flex row justifyCenter>
                <ButtonGroup>
                  <Button
                    appearance="primary"
                    onClick={() => {
                      dispatch(screenshotsActions.closeTestScreenshotWindow());
                    }}
                  >
                    Close
                  </Button>
                </ButtonGroup>
              </Flex>
            ) : (
              <Flex row justifyCenter>
                {isDismissed
                  ? (
                    <ButtonGroup>
                      <Button
                        appearance="primary"
                        onClick={() => {
                          dispatch(screenshotsActions.dismissOnlyScreenshot());
                        }}
                      >
                        Only screenshot
                      </Button>
                      <Button
                        appearance="warning"
                        onClick={() => {
                          dispatch(screenshotsActions.dismissTimeAndScreenshot());
                        }}
                      >
                        Screenshot with time
                      </Button>
                    </ButtonGroup>
                  ) : (
                    <ButtonGroup>
                      <Button
                        appearance="primary"
                        onClick={() => {
                          dispatch(screenshotsActions.keepScreenshot());
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        appearance="warning"
                        onClick={() => {
                          this.setState({
                            isDismissed: true,
                            currentTime: 0,
                          });
                        }}
                      >
                        Dismiss
                      </Button>
                    </ButtonGroup>
                  )
                }
              </Flex>
            )}
        </Flex>
      </S.Popup>
    );
  }
}

ScreenshotPopup.propTypes = {
  screenshot: PropTypes.string.isRequired,
  isTest: PropTypes.bool.isRequired,
  decisionTime: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    screenshot: state.screenshotNotificationReducer.screenshot,
    isTest: state.screenshotNotificationReducer.isTest,
    decisionTime: state.screenshotNotificationReducer.decisionTime,
  };
}

const connector = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default hot(connector(ScreenshotPopup));
