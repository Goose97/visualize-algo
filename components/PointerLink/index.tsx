import React, { Component } from 'react';
import { omit, isFunction } from 'lodash';

import withExtendClassName, {
  WithExtendClassName,
} from 'hocs/withExtendClassName';
import { classNameHelper } from 'utils';
import { IProps, IState } from './index.d';

type PropsWithHoc = IProps & WithExtendClassName;

export class PointerLink extends Component<PropsWithHoc, IState> {
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
    const { visited, highlight, following, className } = this.props;
    return classNameHelper({
      base: [className, 'pointer-link has-transition']
        .filter(item => item)
        .join(' '),
      disappearing: !!isDisappearing,
      visited: !!visited,
      following: !!following,
      highlight: !!highlight,
    });
  }

  renderMainPointerLink() {
    const { path, isNew, animationDuration, onAnimationEnd } = this.props;
    const fullPathWithArrow = `${path} ${this.produceArrowPath()}`;
    const className = classNameHelper({
      base: 'pointer-link__line',
      ['animated-path']: !!isNew,
    });
    return (
      <path
        d={fullPathWithArrow}
        className={className}
        style={{ animationDuration }}
        onAnimationEnd={() =>
          isFunction(onAnimationEnd) && onAnimationEnd('appear')
        }
      />
    );
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
    const { highlight, following, className } = this.props;
    const shouldRender = following || highlight;
    const compoundClassName = classNameHelper({
      // base: [className, 'pointer-link__line'].filter(item => !item).join(' '),
      base: 'pointer-link__line',
      ['follow animated-path']: !!following,
      highlight: !!highlight,
    });
    return (
      shouldRender && (
        <path
          d={this.produceFullPathWithArrow()}
          className={compoundClassName}
        />
      )
    );
  }

  render() {
    const propsToOmit = [
      'arrowDirection',
      'following',
      'visited',
      'visible',
      'isNew',
      'animationDuration',
      'onAnimationEnd',
    ];

    return (
      <g {...omit(this.props, propsToOmit)} className={this.produceClassName()}>
        {this.renderFocusMaskOnPointerLink()}
        {this.renderMainPointerLink()}
        {this.produceStartPointMark()}
      </g>
    );
  }
}

export default withExtendClassName('')(PointerLink);
