import React, {
  Component,
} from 'react';
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
    const { decisionTime } = this.props;
    this.state = {
      decisionTime,
      currentTime: 0,
      isDismissed: false,
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => this.tick(), 1000);
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
    } = this.state;
    const {
      screenshot,
      isTest,
      dispatch,
    } = this.props;

    return (
      <S.Popup>
        <Flex column>
          <S.PopupImage src={`file://${screenshot}`} />
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
                        Dismiss only screenshot
                      </Button>
                      <Button
                        appearance="warning"
                        onClick={() => {
                          dispatch(screenshotsActions.dismissTimeAndScreenshot());
                        }}
                      >
                        Dismiss screenshot with time
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
