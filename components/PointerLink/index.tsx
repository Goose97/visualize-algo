import React, { Component } from 'react';

import { classNameHelper } from 'utils';
import { IProps, IState } from './index.d';
import { PointCoordinate } from 'types';

const ANIMATION_STEP_COUNT = 20;

export class PointerLink extends Component<IProps, IState> {
  private intervalToken: number[];
  private original?: { start: PointCoordinate; finish: PointCoordinate };
  private step?: number;
  constructor(props: IProps) {
    super(props);

    this.state = {
      // We will use this offset to animate
      offsetFromFinish: 0,
      transformList: [],
    };
    this.intervalToken = [];

    this.setUpNewOrigin();
  }

  setUpNewOrigin() {
    const { start, finish } = this.props;
    this.original = {
      start,
      finish,
    };
  }

  componentDidUpdate(prevProps: IProps) {
    const {
      visible,
      finish: { x, y },
      following,
      visited,
    } = this.props;
    if (visible !== prevProps.visible) {
      if (!visible) this.hide();
    }

    // Change in position
    if (x !== prevProps.finish.x) {
      if (this.getLinkLength(this.props) !== this.getLinkLength(prevProps)) {
        this.initiateAnimation(prevProps.finish.x, x);
        this.setUpNewOrigin();
      } else {
        this.move(x - prevProps.finish.x, 'horizontal');
      }
    }

    // Change in following state
    if (following && !prevProps.following) {
      this.follow();
    }

    if (!visited && prevProps.visited) {
      this.setState({ isFollowing: false });
    }
  }

  getLinkLength(props: IProps) {
    const {
      start: { x: xStart },
      finish: { x: xFinish },
    } = props;
    return Math.abs(xFinish - xStart);
  }

  initiateAnimation(oldX: number, newX: number) {
    const distance = Math.abs(newX - oldX);
    this.setState({ offsetFromFinish: distance });
    this.step = distance / ANIMATION_STEP_COUNT;
    this.intervalToken.push(window.setInterval(this.updateOffset, 20));
  }

  updateOffset = () => {
    const { offsetFromFinish } = this.state;
    const newOffset = Math.max(offsetFromFinish - this.step!, 0);
    this.setState({ offsetFromFinish: newOffset });
    if (offsetFromFinish <= 0) {
      this.handleFinishAnimation();
    }
  };

  handleFinishAnimation(callback?: () => void) {
    this.intervalToken.forEach(token => window.clearInterval(token));
    if (callback) callback();
  }

  hide() {
    this.setState({ isDisappearing: true });
  }

  move(amount: number, direction: 'horizontal' | 'vertical') {
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

  // animate the action of follow the pointer link
  // use offsetOfFollowAnimation to create animation
  follow() {
    const {
      start: { x: xStart },
      finish: { x: xFinish },
    } = this.original!;
    const initialOffset = Math.abs(xFinish - xStart) - 10;
    this.setState(
      {
        isFollowing: true,
      },
      () => this.initiateFollowAnimation(initialOffset),
    );
  }

  initiateFollowAnimation(distance: number) {
    this.setState({ offsetOfFollowAnimation: distance });
    this.step = distance / ANIMATION_STEP_COUNT;
    this.intervalToken.push(window.setInterval(this.updateOffsetOfFollow, 20));
  }

  updateOffsetOfFollow = () => {
    const { onFinishFollow } = this.props;
    const { offsetOfFollowAnimation } = this.state;
    if (offsetOfFollowAnimation !== undefined && this.step) {
      const newOffset = Math.max(offsetOfFollowAnimation - this.step, 0);
      this.setState({ offsetOfFollowAnimation: newOffset });
      if (offsetOfFollowAnimation <= 0) {
        const cb = () => {
          this.setState({ isDoneFollowing: true });
          onFinishFollow && onFinishFollow();
        };
        this.handleFinishAnimation(cb);
      }
    }
  };

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
    return classNameHelper({
      base: 'pointer-link has-transition',
      disappearing: !!isDisappearing,
      visited: !!visited,
    });
  }

  produceArrowClassName() {
    const { isFollowing, isDoneFollowing } = this.state;
    return classNameHelper({
      base: 'pointer-link__arrow',
      follow: !!(isFollowing && isDoneFollowing),
    });
  }

  constructLinkPath(offsetFromFinish: number) {
    const {
      start: { x: xStart, y: yStart },
      finish: { x: xFinish, y: yFinish },
    } = this.original!;
    return `M ${xStart} ${yStart} L ${
      xFinish - 10 - offsetFromFinish
    } ${yFinish}`;
  }

  render() {
    const {
      start: { x: xStart, y: yStart },
      finish: { x: xFinish, y: yFinish },
    } = this.original!;
    const {
      offsetFromFinish,
      isFollowing,
      offsetOfFollowAnimation,
    } = this.state;

    return (
      <g
        className={this.produceClassName()}
        transform={this.produceTransformString()}
      >
        <path
          d={this.constructLinkPath(offsetFromFinish)}
          className='pointer-link__line'
        />
        {isFollowing && (
          <path
            d={this.constructLinkPath(offsetOfFollowAnimation || 0)}
            className='pointer-link__line follow'
          />
        )}
        <path
          d={`M ${
            xFinish - 10 - offsetFromFinish
          } ${yStart} l -2 5 l 12 -5 l -12 -5 l 2 5`}
          className={this.produceArrowClassName()}
        />
      </g>
    );
  }
}

export default PointerLink;
