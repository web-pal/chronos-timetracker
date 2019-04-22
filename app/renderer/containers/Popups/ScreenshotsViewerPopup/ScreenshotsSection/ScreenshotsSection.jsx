import React from 'react';
import PropTypes from 'prop-types';
import {
  DateTime,
} from 'luxon';

import Viewer from 'react-viewer';
import EditorSearchIcon from '@atlaskit/icon/glyph/editor/search';
import EditorRemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import ChevronRightLargeIcon from '@atlaskit/icon/glyph/chevron-right-large';
import ChevronLeftLargeIcon from '@atlaskit/icon/glyph/chevron-left-large';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import EditorErrorIcon from '@atlaskit/icon/glyph/editor/error';
import Button from '@atlaskit/button';
import 'react-viewer/dist/index.css';

import {
  Flex,
} from 'styles';

class ScreenshotsSection extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    section: PropTypes.object.isRequired,
    onDeleteScreenshot: PropTypes.func.isRequired,
  };

  state = {
    showRightScroller: false,
    showLeftScroller: false,
    screenshotOpen: null,
  };

  constructor(props) {
    super(props);

    this.container = React.createRef();
  }

  componentDidMount() {
    const { container: { current } } = this;

    const pages = Math.ceil(current.scrollWidth / current.offsetWidth);

    this.setState({
      showRightScroller: pages > 1,
    });
  }

  moveRight = () => {
    const { container: { current } } = this;

    current.scrollTo({
      left: current.scrollLeft + current.offsetWidth,
      behaviour: 'smooth',
    });
  }

  moveLeft = () => {
    const { container: { current } } = this;

    current.scrollTo({
      left: current.scrollLeft - current.offsetWidth,
      behaviour: 'smooth',
    });
  }

  handleScroll = (e) => {
    if (e.target.scrollLeft + e.target.offsetWidth >= e.target.scrollWidth) {
      this.setState({
        showRightScroller: false,
      });
    } else if (!this.state.showRightScroller) {
      this.setState({
        showRightScroller: true,
      });
    }
    if (e.target.scrollLeft === 0) {
      this.setState({
        showLeftScroller: false,
      });
    } else if (e.target.scrollLeft > 0 && !this.state.showLeftScroller) {
      this.setState({
        showLeftScroller: true,
      });
    }
  }

  render() {
    const {
      index,
      section: {
        startedAt,
        sectionScreenshots,
      },
    } = this.props;

    const { showRightScroller, showLeftScroller } = this.state;

    return (
      <Flex
        width="100%"
        padding="32px 0 0 0"
        borderLeft="8px solid #0052CC"
      >
        <Flex
          absolute
          top="0px"
          left="0px"
          align={index === 0 ? 'flex-start' : 'flex-end'}
          spacing={4}
          padding={index === 0 ? '0px' : '8px'}
        >
          <Flex
            height="6px"
            width="16px"
            background="#444"
            style={{
              borderTopRightRadius: 2,
              borderBottomRightRadius: 2,
            }}
          />
          <span style={{ fontWeight: 600, lineHeight: '6px' }}>
            {startedAt.toFormat('HH:mm')}
          </span>
        </Flex>
        {showRightScroller && (
          <Flex
            absolute
            right="0px"
            top="16px"
            width="128px"
            background="linear-gradient(90deg, rgba(255,255,255,0.001) 0%, rgba(255,255,255,0.8) 75%, rgba(255,255,255,1) 100%)"
            height="calc(100% - 16px)"
            style={{
              zIndex: 1,
            }}
            align="center"
            justify="flex-end"
            padding="16px"
            clickable
            onClick={this.moveRight}
          >
            <ChevronRightLargeIcon size="large" />
          </Flex>
        )}
        {showLeftScroller && (
          <Flex
            absolute
            left="0px"
            top="16px"
            width="128px"
            background="linear-gradient(-90deg, rgba(255,255,255,0.001) 0%, rgba(255,255,255,0.8) 75%, rgba(255,255,255,1) 100%)"
            height="calc(100% - 16px)"
            style={{
              zIndex: 1,
            }}
            align="center"
            padding="16px"
            clickable
            onClick={this.moveLeft}
          >
            <ChevronLeftLargeIcon size="large" />
          </Flex>
        )}
        <Flex
          scroll
          innerRef={this.container}
          onScroll={this.handleScroll}
          width="100%"
        >
          {sectionScreenshots.map((s, n) => (
            <Flex
              key={s.timestamp}
              flex="0 0 256px"
              height="168px"
              borderBottom="2px solid #0052cc"
              padding={`0 16px 0 ${n === 0 ? '16px' : '0'}`}
            >
              <Flex height="100%" width="100%">
                <Flex column width="100%" height="100%">
                  <Flex padding="0 8px 0 0" width="100%" height="100%">
                    {(
                      s.status === 'success'
                      || s.status === 'offline'
                    )
                      && (
                        <img
                          alt={`screenshot number ${n}`}
                          src={s.thumbUrl}
                          width="100%"
                          height="100%"
                          style={{
                            objectFit: 'cover',
                          }}
                        />
                      )
                    }
                    {s.status === 'idle'
                      && (
                        <Flex
                          width="100%"
                          height="100%"
                          align="center"
                          justify="center"
                          background="#f9f9f9"
                          spacing={4}
                          column
                        >
                          <QuestionCircleIcon size="xlarge" primaryColor="#e6e6e6" />
                          <span
                            style={{
                              fontSize: 16,
                              fontWeight: 900,
                              opacity: 0.2,
                              textTransform: 'uppercase',
                            }}
                          >
                            idle
                          </span>
                        </Flex>
                      )
                    }
                    {s.status === 'deleted'
                      && (
                        <Flex
                          width="100%"
                          height="100%"
                          align="center"
                          justify="center"
                          background="#f9f9f9"
                          spacing={4}
                          column
                        >
                          <EditorRemoveIcon
                            size="xlarge"
                            primaryColor="#e6e6e6"
                          />
                          <span
                            style={{
                              fontSize: 16,
                              fontWeight: 900,
                              opacity: 0.2,
                              textTransform: 'uppercase',
                            }}
                          >
                            deleted
                          </span>
                        </Flex>
                      )
                    }
                    {s.status === 'dismissed'
                      && (
                        <Flex
                          width="100%"
                          height="100%"
                          align="center"
                          justify="center"
                          background="#f9f9f9"
                          spacing={4}
                          column
                        >
                          <EditorErrorIcon size="xlarge" primaryColor="#e6e6e6" />
                          <span
                            style={{
                              fontSize: 16,
                              fontWeight: 900,
                              opacity: 0.2,
                              textTransform: 'uppercase',
                            }}
                          >
                            dismissed
                          </span>
                        </Flex>
                      )
                    }
                  </Flex>
                  {s.activityPercentage
                    ? (
                      <Flex width="100%" spacing={8} padding="8px 8px 8px 0" align="center">
                        <span style={{ whiteSpace: 'nowrap' }}>
                          {s.activityPercentage.toFixed(0)} %
                        </span>
                        <Flex width="100%" borderRadius="4px" height="8px" background="#e3e3e3">
                          <Flex width={`${s.activityPercentage.toFixed(0)}%`} borderRadius="4px" height="8px" background="#0FBC6F" />
                        </Flex>
                      </Flex>
                    ) : (
                      <Flex width="100%" spacing={8} padding="8px 8px 8px 0" align="center">
                        <span style={{ whiteSpace: 'nowrap' }}>
                          ? %
                        </span>
                        <Flex width="100%" borderRadius="4px" height="8px" background="#e3e3e3">
                          <Flex width="40%" borderRadius="4px" height="8px" background="#ccc" />
                        </Flex>
                      </Flex>
                    )
                  }
                </Flex>
              </Flex>
              <Flex height="100%" column justify="space-between">
                {s.status === 'success'
                  ? (
                    <Flex
                      column
                      width="42px"
                      padding="4px"
                      spacing={4}
                      background="#f3f3f3"
                      style={{
                        borderBottomRightRadius: 3,
                        borderTopRightRadius: 3,
                        transform: 'translateX(-8px)',
                      }}
                    >
                      <Button
                        appearance="subtle"
                        spacing="compact"
                        iconAfter={<EditorSearchIcon />}
                        onClick={() => this.setState({
                          screenshotOpen: n,
                        })}
                      />
                      <Button
                        spacing="compact"
                        appearance="subtle"
                        iconAfter={<EditorRemoveIcon />}
                        onClick={() => {
                          this.props.onDeleteScreenshot(s);
                        }}
                      />
                    </Flex>
                  ) : <div />
                }
                <Flex column width="100%" spacing={4} align="center">
                  <span
                    style={{
                      whiteSpace: 'nowrap',
                      fontSize: 12,
                      lineHeight: '16px',
                    }}
                  >
                    {DateTime.fromMillis(s.timestamp).toFormat('HH:mm')}
                  </span>
                  <Flex height="12px" background="#444" width="2px" />
                </Flex>
              </Flex>
            </Flex>
          ))}
          <Viewer
            visible={this.state.screenshotOpen !== null}
            onClose={() => { this.setState({ screenshotOpen: null }); }}
            activeIndex={this.state.screenshotOpen}
            images={sectionScreenshots.map((s, i) => ({ src: s.imgUrl, alt: `screenshot number ${i}` }))}
          />
        </Flex>
      </Flex>
    );
  }
}

export default ScreenshotsSection;
