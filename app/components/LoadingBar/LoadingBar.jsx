import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

export const UPDATE_TIME = 200;
export const MAX_PROGRESS = 99;
export const PROGRESS_INCREASE = 10;
export const ANIMATION_TIME = UPDATE_TIME * 2;

const initialState = {
  endingAnimationTimeout: null,
  percent: 0,
  progressInterval: null,
};

class LoadingBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = initialState;

    this.boundSimulateProgress = this.simulateProgress.bind(this);
    this.boundResetProgress = this.resetProgress.bind(this);
  }

  componentDidMount() {
    if (this.props.loading > 0) {
      this.launch();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.shouldStart(nextProps)) {
      this.launch();
    } else if (this.shouldStop(nextProps)) {
      this.setState({ percent: 100 });
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.progressInterval);
    clearTimeout(this.state.endingAnimationTimeout);
  }

  shouldStart(nextProps) {
    return this.props.loading === 0 && nextProps.loading > 0;
  }

  shouldStop(nextProps) {
    return this.state.progressInterval && nextProps.loading === 0;
  }

  shouldShow() {
    return this.state.percent > 0 && this.state.percent <= 100;
  }

  launch() {
    let { progressInterval, percent } = this.state;
    const { endingAnimationTimeout } = this.state;

    if (!progressInterval) {
      progressInterval = setInterval(
        this.boundSimulateProgress,
        this.props.updateTime,
      );
      clearTimeout(endingAnimationTimeout);
      percent = 0;
    }

    this.setState({ progressInterval, percent });
  }

  newPercent() {
    const { percent } = this.state;
    const { progressIncrease } = this.props;

    // Use cos as a smoothing function
    // Can be any function to slow down progress near the 100%
    const smoothedProgressIncrease = (
      progressIncrease * Math.cos(percent * (Math.PI / 2 / 100))
    );

    return percent + smoothedProgressIncrease;
  }

  simulateProgress() {
    let { progressInterval, percent, endingAnimationTimeout } = this.state;
    const { maxProgress, progressIncrease, infinite } = this.props;

    if (infinite) {
      if (percent >= 40 && percent < 40 + progressIncrease) {
        clearInterval(progressInterval);
        progressInterval = setInterval(
          this.boundSimulateProgress,
          1000,
        );
      }
      if (percent >= 50 && percent < 50 + progressIncrease) {
        clearInterval(progressInterval);
        progressInterval = setInterval(
          this.boundSimulateProgress,
          2000,
        );
      }
      if (percent >= 80 && percent < 80 + progressIncrease) {
        clearInterval(progressInterval);
        progressInterval = setInterval(
          this.boundSimulateProgress,
          5000,
        );
      }
    }

    if (percent === 100) {
      clearInterval(progressInterval);
      endingAnimationTimeout = setTimeout(
        this.boundResetProgress,
        ANIMATION_TIME,
      );
      progressInterval = null;
    } else if (this.newPercent() <= maxProgress) {
      percent = this.newPercent();
    }

    this.setState({ percent, progressInterval, endingAnimationTimeout });
  }

  resetProgress() {
    this.setState(initialState);
  }

  buildStyle() {
    const style = {
      width: `${this.state.percent}%`,
      transition: `width ${ANIMATION_TIME}ms linear`,
      opacity: '1',
    };

    // Use default styling if there's no CSS class applied
    if (!this.props.className) {
      style.height = '3px';
      style.backgroundColor = 'red';
      style.position = 'absolute';
    }

    if (this.shouldShow()) {
      style.opacity = '1';
    } else {
      style.opacity = '0';
    }

    return { ...style, ...this.props.style };
  }

  render() {
    return (
      <div>
        <div style={this.buildStyle()} className={this.props.className} />
        <div style={{ display: 'table', clear: 'both' }} />
      </div>
    );
  }
}

LoadingBar.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  loading: PropTypes.number,
  updateTime: PropTypes.number,
  maxProgress: PropTypes.number,
  progressIncrease: PropTypes.number,
  infinite: PropTypes.bool,
};

LoadingBar.defaultProps = {
  style: {},
  className: undefined,
  loading: 0,
  updateTime: UPDATE_TIME,
  maxProgress: MAX_PROGRESS,
  progressIncrease: PROGRESS_INCREASE,
  infinite: false,
};

const mapStateToProps = state => ({
  loading: state.loadingBar,
});

export default connect(mapStateToProps)(LoadingBar);
