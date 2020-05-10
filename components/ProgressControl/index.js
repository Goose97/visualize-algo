import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faStop,
  faStepBackward,
  faFastBackward,
  faStepForward,
  faFastForward,
} from '@fortawesome/free-solid-svg-icons';

import { classNameHelper } from '../../utils';
import './style.scss';

export class ProgressControl extends Component {
  handleControlProgress = index => () => {
    const handlerFunction = this.getHandlerFunction(index);
    handlerFunction && handlerFunction();
  };

  getHandlerFunction(buttonIndex) {
    const {
      onFastBackward,
      onBackward,
      onPlay,
      onStop,
      onForward,
      onFastForward,
      isPlaying,
    } = this.props;
    switch (buttonIndex) {
      case 0:
        return onFastBackward;
      case 1:
        return onBackward;
      case 2:
        return isPlaying ? onStop : onPlay;
      case 3:
        return onForward;
      case 4:
        return onFastForward;
    }
  }

  renderProgressIndicator() {
    const { progress } = this.props;
    const roundedProgress = `${progress.toFixed(2)}%`;
    return (
      <div className='progress-control__progress-indicator'>
        <div
          className='progress-control__progress-bar'
          style={{ width: roundedProgress }}
        ></div>
      </div>
    );
  }

  produceButtonClassName(buttonIndex) {
    return classNameHelper({
      base: 'progress-control__button',
      disabled: this.isButtonDisabled(buttonIndex),
    });
  }

  isButtonDisabled = buttonIndex => {
    const { progress } = this.props;
    switch (buttonIndex) {
      case 0:
      case 1:
        return progress === 0;
      case 3:
      case 4:
        return progress === 100;
      default:
        return false;
    }
  };

  render() {
    const { isPlaying } = this.props;
    return (
      <div className='progress-control__wrapper'>
        <div className='progress-control__button-wrapper'>
          {[
            faFastBackward,
            faStepBackward,
            isPlaying ? faStop : faPlay,
            faStepForward,
            faFastForward,
          ].map((icon, index) => (
            <span
              className={this.produceButtonClassName(index)}
              key={index}
              onClick={this.handleControlProgress(index)}
            >
              <FontAwesomeIcon icon={icon} />
            </span>
          ))}
        </div>
        {this.renderProgressIndicator()}
      </div>
    );
  }
}

export default ProgressControl;