import React, { Component } from 'react';

import { IProps, IState } from './index.d';

const DEFAULT_ANIMATION_DURATION = 1200;
const STEP_COUNT = 80;
// if max percent is 100 then the circle will disappear because start and end point are the same
const MAX_PERCENT = 97;

export class HighlightCircle extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    // This state's purpose is to make circling animation
    this.state = {
      completePercent: 0,
      isAnimating: true,
    };
  }

  componentDidMount() {
    this.kickStartAnimationInterval();
  }

  kickStartAnimationInterval = () => {
    const { completePercent } = this.state;
    const stepInterval = DEFAULT_ANIMATION_DURATION / STEP_COUNT;
    const percentIncreaseAtEachStep = 100 / STEP_COUNT;
    const newPercent = Math.min(
      MAX_PERCENT,
      completePercent + percentIncreaseAtEachStep,
    );
    this.setState({ completePercent: newPercent }, () => {
      if (this.state.completePercent === MAX_PERCENT) return;
      setTimeout(this.kickStartAnimationInterval, stepInterval);
    });
  };

  caculateArcEndPointAndFlag() {
    // We will cover each section of the circle one by one
    const { completePercent } = this.state;
    const { radius } = this.props;
    let deltaX;
    let deltaY;
    if (completePercent <= 25) {
      const angle = ((completePercent / 25) * Math.PI) / 2;
      deltaX = Math.sin(angle) * radius;
      deltaY = (1 - Math.cos(angle)) * radius;
    } else if (completePercent <= 50) {
      const angle = (((completePercent - 25) / 25) * Math.PI) / 2;
      deltaX = Math.cos(angle) * radius;
      deltaY = (1 + Math.sin(angle)) * radius;
    } else if (completePercent <= 75) {
      const angle = (((completePercent - 50) / 25) * Math.PI) / 2;
      deltaX = -Math.sin(angle) * radius;
      deltaY = (1 + Math.cos(angle)) * radius;
    } else {
      const angle = (((completePercent - 75) / 25) * Math.PI) / 2;
      deltaX = -Math.cos(angle) * radius;
      deltaY = (1 - Math.sin(angle)) * radius;
    }

    return {
      x: deltaX,
      y: deltaY,
      largeArcFlag: completePercent >= 50 ? 1 : 0,
    };
  }

  render() {
    const { x, y, radius } = this.props;
    const {
      x: endX,
      y: endY,
      largeArcFlag,
    } = this.caculateArcEndPointAndFlag();

    return (
      <path
        className='highlight-circle'
        d={`M ${x} ${
          y - radius
        } a ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`}
      />
    );
  }
}

export default HighlightCircle;
