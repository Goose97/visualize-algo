import React, { Component } from 'react';

import { classNameHelper } from 'utils';
import { IProps, IState } from './index.d';

export class PointerLink extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      // We will use this offset to animate
      offsetFromFinish: 0,
      transformList: [],
    };
  }

  componentDidUpdate(prevProps: IProps) {
    const { visible, following, visited } = this.props;
    if (visible !== prevProps.visible) {
      if (!visible) this.hide();
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

  hide() {
    this.setState({ isDisappearing: true });
  }

  follow() {
    this.setState({
      isFollowing: true,
    });
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

  produceFullPathWithArrow() {
    const { path } = this.props;
    return `${path} ${this.produceArrowPath()}`;
  }

  produceArrowPath() {
    const { arrowDirection } = this.props;
    switch (arrowDirection) {
      case 'right':
        return 'l -2 5 l 12 -5 l -12 -5 l 2 5';
      default:
        return '';
    }
  }

  render() {
    const { isFollowing } = this.state;

    return (
      <g className={this.produceClassName()}>
        <path d={this.produceFullPathWithArrow()} className='pointer-link__line' />
        {isFollowing && (
          <path d={this.produceFullPathWithArrow()} className='pointer-link__line follow animated-path' />
        )}
        {/* <path
          d={`M ${
            xFinish - 10 - offsetFromFinish
          } ${yStart} l -2 5 l 12 -5 l -12 -5 l 2 5`}
          className={this.produceArrowClassName()}
        /> */}
      </g>
    );
  }
}

export default PointerLink;
