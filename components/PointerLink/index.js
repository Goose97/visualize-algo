import React, { Component } from 'react';

import './style.scss';

const ANIMATION_STEP_COUNT = 20;

export class PointerLink extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // We will use this offset to animate
      offsetFromFinish: 0,
      transformList: [],
    };
    this.intervalToken = [];

    this.setUpNewOrigin();
  }

  componentDidUpdate(prevProps) {
    const {
      visible,
      finish: { x, y },
    } = this.props;
    if (visible !== prevProps.visible) {
      if (!visible) this.hide();
    }

    if (x !== prevProps.finish.x) {
      if (this.getLinkLength(this.props) !== this.getLinkLength(prevProps)) {
        this.initiateAnimation(prevProps.finish.x, x);
        this.setUpNewOrigin();
      } else {
        this.move(x - prevProps.finish.x, 'horizontal');
      }
    }
  }

  getLinkLength(props) {
    const {
      start: { x: xStart },
      finish: { x: xFinish },
    } = props;
    return Math.abs(xFinish - xStart);
  }

  initiateAnimation(oldX, newX) {
    const distance = Math.abs(newX - oldX);
    this.setState({ offsetFromFinish: distance });
    this.step = distance / ANIMATION_STEP_COUNT;
    this.intervalToken.push(setInterval(this.updateOffset, 20));
  }

  setUpNewOrigin() {
    const { start, finish } = this.props;
    this.original = {
      start,
      finish,
    };
  }

  hide() {
    this.setState({ isDisappearing: true });
  }

  updateOffset = () => {
    const { offsetFromFinish } = this.state;
    const newOffset = Math.max(offsetFromFinish - this.step, 0);
    this.setState({ offsetFromFinish: newOffset });
    if (offsetFromFinish <= 0) {
      this.handleFinishAnimation();
    }
  };

  handleFinishAnimation() {
    this.intervalToken.forEach(token => window.clearInterval(token));
  }

  move(amount, direction) {
    const { transformList } = this.state;
    let transformText;
    switch (direction) {
      case 'vertical':
        transformText = `translate(0 ${amount})`;
        break;
      case 'horizontal':
        transformText = `translate(${amount} 0)`;
        break;
    }
    this.setState({ transformList: [...transformList, transformText] });
  }

  produceTransformString() {
    const { transformList } = this.state;
    return transformList.join(' ');
  }

  resetTransform() {
    this.setState({ transformList: [] });
  }

  produceClassName() {
    const { isDisappearing } = this.state;
    const { visited } = this.props;
    let baseClassName = 'pointer-link has-transition';
    if (isDisappearing) baseClassName += ' disappearing';
    if (visited) baseClassName += ' visited';
    return baseClassName;
  }

  render() {
    const {
      start: { x: xStart, y: yStart },
      finish: { x: xFinish, y: yFinish },
    } = this.original;
    const { offsetFromFinish } = this.state;

    const constructPath = () => {
      return `M ${xStart} ${yStart} L ${xFinish -
        10 -
        offsetFromFinish} ${yFinish}`;
    };

    return (
      <g
        className={this.produceClassName()}
        transform={this.produceTransformString()}
      >
        <path d={constructPath()} className='pointer-link__line' />
        <path
          d={`M ${xFinish -
            10 -
            offsetFromFinish} ${yStart} l -2 5 l 12 -5 l -12 -5 l 2 5`}
          className='pointer-link__arrow'
        />
      </g>
    );
  }
}

export default PointerLink;
