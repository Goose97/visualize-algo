import React, { Component } from "react";

const ANIMATION_STEP_COUNT = 20;

export class PointerLink extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // We will use this offset to animate
      offsetFromFinish: 0,
      transformList: []
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { isAnimating } = this.props;
    if (isAnimating && !prevProps.isAnimating) {
      this.initiateAnimation();
    }
  }

  initiateAnimation() {
    this.setState({ offsetFromFinish: 100 });
    this.step = 100 / ANIMATION_STEP_COUNT;
    this.intervalToken = setInterval(this.updateOffset, 20);
  }

  updateOffset = () => {
    const { offsetFromFinish } = this.state;
    const newOffset = Math.max(offsetFromFinish - this.step, 0);
    this.setState({ offsetFromFinish: newOffset });
    if (offsetFromFinish <= 0) this.handleFinishAnimation();
  };

  handleFinishAnimation() {
    const { onFinishAnimation } = this.props;
    onFinishAnimation && onFinishAnimation();
    window.clearInterval(this.intervalToken);
  }

  move(amount, direction) {
    const { transformList } = this.state;
    let transformText;
    switch (direction) {
      case "top":
        transformText = `translate(0 ${-amount})`;
        break;
      case "down":
        transformText = `translate(0 ${amount})`;
        break;
      case "left":
        transformText = `translate(${-amount} 0)`;
        break;
      case "right":
        transformText = `translate(${amount} 0)`;
        break;
    }
    this.setState({ transformList: [...transformList, transformText] });
  }

  produceTransformString() {
    const { transformList } = this.state;
    return transformList.join(" ");
  }

  resetTransform() {
    this.setState({ transformList: [] });
  }

  render() {
    const {
      start: { x: xStart, y: yStart },
      finish: { x: xFinish, y: yFinish }
    } = this.props;
    const { offsetFromFinish } = this.state;

    const constructPath = () => {
      return `M ${xStart + 50} ${yStart + 25} H ${xFinish -
        10 -
        offsetFromFinish}`;
    };

    return (
      <g className="pointer-link" transform={this.produceTransformString()}>
        <path d={constructPath()} className="pointer-link__line" />
        <path
          d={`M ${xFinish - 10 - offsetFromFinish} ${yStart +
            25} l -2 5 l 12 -5 l -12 -5 l 2 5`}
          className="pointer-link__arrow"
        />
      </g>
    );
  }
}

export default PointerLink;
