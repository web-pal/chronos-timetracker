import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Flex from '../components/Base/Flex/Flex';
import Timer from '../components/Timer/Timer';
import TrackerHeader from '../components/TrackerHeader/TrackerHeader';

import * as trackerActions from '../actions/tracker';

function mapStateToProps(state) {
  return {
    trackingIssue: state.get('context').currentIssue,
    time: state.get('tracker').time,
    running: state.get('tracker').running,
    paused: state.get('tracker').paused,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(trackerActions, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Tracker extends Component {
  static propTypes = {
    trackingIssue: PropTypes.object.isRequired,
    time: PropTypes.number.isRequired,
    running: PropTypes.bool.isRequired,
    paused: PropTypes.bool.isRequired,
    startTimer: PropTypes.func.isRequired,
    pauseTimer: PropTypes.func.isRequired,
    stopTimer: PropTypes.func.isRequired,
    tick: PropTypes.func.isRequired,
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.running && nextProps.running) {
      this.timerLoop = setInterval(() => this.tick(), 930);
    }
    if (this.props.running && !nextProps.running) {
      clearInterval(this.timerLoop);
    }
  }

  handleTimerStart = () => {
    this.props.startTimer();
  }

  handleTimerPause = () => {
    this.props.pauseTimer();
  }

  handleTimerStop = () => {
    this.props.stopTimer();
  }

  tick = () => {
    this.props.tick();
  }

  render() {
    const { running, paused, time, trackingIssue } = this.props;
    return (
      <Flex column className="tracker">
        <TrackerHeader currentIssue={trackingIssue} />
        <Timer
          running={running}
          paused={paused}
          time={time}
          trackingIssue={trackingIssue}
          onStart={this.handleTimerStart}
          onStop={this.handleTimerStop}
          onPause={this.handleTimerPause}
        />
      </Flex>
    );
  }
}
