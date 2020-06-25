import React, { Component } from 'react';

import { IProps } from './index.d';

export class PanZoomController extends Component<IProps> {
  render() {
    const { onZoomIn, onZoomOut } = this.props;

    return (
      <div className='zoom-controller__wrapper'>
        <div
          className='mb-4 fx-center f-big-1 shadow-1 clickable'
          onClick={onZoomIn}
        >
          +
        </div>
        <div
          className='mb-4 fx-center f-big-1 shadow-1 clickable'
          onClick={onZoomOut}
        >
          -
        </div>
      </div>
    );
  }
}

export default PanZoomController;
