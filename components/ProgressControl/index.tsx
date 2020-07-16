import React, { PureComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faStop,
  faStepBackward,
  faFastBackward,
  faStepForward,
  faFastForward,
} from '@fortawesome/free-solid-svg-icons';

import { classNameHelper } from 'utils';
import { IProps } from './index.d';

export class ProgressControl extends PureComponent<IProps> {
  handleControlProgress = (index: number) => () => {
    const handlerFunction = this.getHandlerFunction(index);
    handlerFunction && !this.isButtonDisabled(index) && handlerFunction();
  };

  getHandlerFunction(buttonIndex: number) {
    const {
      onFastBackward,
      onBackward,
      onPlay,
      onStop,
      onForward,
      onFastForward,
      autoPlay,
    } = this.props;
    switch (buttonIndex) {
      case 0:
        return onFastBackward;
      case 1:
        return onBackward;
      case 2:
        return autoPlay ? onStop : onPlay;
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

  produceButtonClassName(buttonIndex: number) {
    return classNameHelper({
      base: 'progress-control__button',
      disabled: this.isButtonDisabled(buttonIndex),
      ['play-button']: buttonIndex === 2,
    });
  }

  isButtonDisabled = (buttonIndex: number) => {
    const { progress, disabled } = this.props;
    if (disabled) return true;
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
    const { autoPlay, className } = this.props;
    let baseClassName = 'progress-control__wrapper';
    if (className) baseClassName += ` ${className}`;
    return (
      <div className={baseClassName}>
        <div className='progress-control__button-wrapper'>
          {[
            faFastBackward,
            faStepBackward,
            autoPlay ? faStop : faPlay,
            faStepForward,
            faFastForward,
          ].map((icon, index) => {
            return (
              <button
                className={this.produceButtonClassName(index)}
                key={index}
                onClick={this.handleControlProgress(index)}
              >
                <FontAwesomeIcon icon={icon} />
              </button>
            );
          })}
        </div>
        {this.renderProgressIndicator()}
      </div>
    );
  }
}

export default ProgressControl;
