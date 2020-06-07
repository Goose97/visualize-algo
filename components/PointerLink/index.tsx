import React, { Component } from 'react';
import { omit } from 'lodash';

import { classNameHelper } from 'utils';
import { IProps, IState } from './index.d';

export class PointerLink extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      // We will use this offset to animate
      transformList: this.produceInitialTransformList(),
    };
  }

  produceInitialTransformList() {
    const { transform } = this.props;
    if (transform) {
      const regexMatch = transform.match(/(rotate|translate)\(.+\)/g);
      return regexMatch ? regexMatch : [];
    } else {
      return [];
    }
  }

  componentDidUpdate(prevProps: IProps) {
    const { visible, following, visited } = this.props;
    if (visible !== prevProps.visible) {
      if (!visible) this.hide();
    }
  }

  hide() {
    this.setState({ isDisappearing: true });
  }

  produceClassName() {
    const { isDisappearing } = this.state;
    const { visited, highlight, following } = this.props;
    return classNameHelper({
      base: 'pointer-link has-transition',
      disappearing: !!isDisappearing,
      visited: !!visited,
      following: !!following,
      highlight: !!highlight,
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
    const { path, visited, following } = this.props;
    const regex = /^M (\d+) (\d+)/;
    const startPoint = path?.match(regex);
    if (startPoint) {
      const className = classNameHelper({
        base: 'pointer-link__start-dot',
        follow: !!following,
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

  renderFocusMaskOnPointerLink() {
    // Just a layer of pointer link of top of the original one
    // Create a effect of highlight when focus
    const { highlight, following } = this.props;
    const shouldRender = following || highlight;
    const className = classNameHelper({
      base: 'pointer-link__line',
      ['follow animated-path']: !!following,
      highlight: !!highlight,
    });
    return (
      shouldRender && (
        <path d={this.produceFullPathWithArrow()} className={className} />
      )
    );
  }

  render() {
    const propsToOmit = ['arrowDirection', 'following', 'visited', 'visible'];

    return (
      <g className={this.produceClassName()} {...omit(this.props, propsToOmit)}>
        {this.renderFocusMaskOnPointerLink()}
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
