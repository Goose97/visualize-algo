import React, { Component } from 'react';

import { classNameHelper } from 'utils';
import { IProps, IState } from './index.d';

export class PointerLink extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      // We will use this offset to animate
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

  produceFullPathWithArrow() {
    const { path } = this.props;
    return `${path} ${this.produceArrowPath()}`;
  }

  produceArrowPath() {
    const { arrowDirection } = this.props;
    switch (arrowDirection) {
      case 'right':
        return 'l -2 2 l 8 -2 l -8 -2 l 2 2';
      case 'left':
        return 'l 2 2 l -8 -2 l 8 -2 l -2 2';
      case 'up':
        return 'l 2 2 l -2 -8 l -2 8 l 2 -2';
      default:
        return '';
    }
  }

  produceStartPointMark() {
    const { isFollowing } = this.state;
    const { path, visited } = this.props;
    const regex = /^M (\d+) (\d+)/;
    const startPoint = path.match(regex);
    if (startPoint) {
      const className = classNameHelper({
        base: 'pointer-link__start-dot',
        follow: !!isFollowing,
        visited: !!visited,
      });
      return (
        <circle
          cx={startPoint[1]}
          cy={startPoint[2]}
          r='2'
          className={className}
        />
      );
    } else return null;
  }

  render() {
    const { isFollowing } = this.state;

    return (
      <g className={this.produceClassName()}>
        {isFollowing && (
          <path
            d={this.produceFullPathWithArrow()}
            className='pointer-link__line follow animated-path'
          />
        )}
        <path
          d={this.produceFullPathWithArrow()}
          className='pointer-link__line'
        />
        {this.produceStartPointMark()}
      </g>
    );
  }
}

export default PointerLink;
