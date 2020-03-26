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

  render() {
    const { isPlaying } = this.props;
    return (
      <div className='progress-control__wrapper'>
        {[
          faFastBackward,
          faStepBackward,
          isPlaying ? faStop : faPlay,
          faStepForward,
          faFastForward,
        ].map((icon, index) => (
          <span
            className='progress-control__button'
            key={index}
            onClick={this.handleControlProgress(index)}
          >
            <FontAwesomeIcon icon={icon} />
          </span>
        ))}
      </div>
    );
  }
}

export default ProgressControl;
