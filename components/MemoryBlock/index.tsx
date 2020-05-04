import React, { Component } from 'react';

import { classNameHelper } from 'utils';
import { IProps, IState } from './index.d';
import { PointCoordinate } from 'types';
import {
  LINKED_LIST_BLOCK_WIDTH,
  LINKED_LIST_BLOCK_HEIGHT,
} from '../../constants';

const POINTER_HOLDER_WIDTH = 20;

export class MemoryBlock extends Component<IProps, IState> {
  private original: PointCoordinate;
  constructor(props: IProps) {
    super(props);
    this.state = {
      transformList: [],
    };
    this.original = {
      x: props.x,
      y: props.y,
    };
  }

  componentDidUpdate(prevProps: IProps) {
    (['x', 'y', 'visible'] as Array<keyof IProps>).forEach(attribute =>
      this.checkDiffAndReact(
        prevProps[attribute],
        this.props[attribute],
        attribute,
      ),
    );
  }

  checkDiffAndReact(prev: any, now: any, attribute: keyof IProps) {
    switch (attribute) {
      case 'visible':
        return this.checkVisibleAndReact(prev, now);
      case 'x':
        return this.checkXAxisAndReact(prev, now);
      case 'y':
        return this.checkYAxisAndReact(prev, now);
    }
  }

  checkVisibleAndReact(prev: boolean, now: boolean) {
    if (prev !== now) {
      now ? this.show() : this.hide();
    }
  }

  hide() {
    this.setState({ isHiding: true });
    setTimeout(() => {
      this.setState({ isHiding: false });
    }, 500);
  }

  show() {
    this.setState({ isShowing: true });
    setTimeout(() => {
      this.setState({ isShowing: false });
    }, 500);
  }

  checkXAxisAndReact(prev: number, now: number) {
    if (prev !== now) this.move(now - prev, 'horizontal');
  }

  checkYAxisAndReact(prev: number, now: number) {
    if (prev !== now) this.move(now - prev, 'vertical');
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

  produceTransformString() {
    const { transformList } = this.state;
    return transformList.join(' ');
  }

  resetTransform() {
    this.setState({ transformList: [] });
  }

  produceClassName() {
    const { visible, visited, focus } = this.props;
    const { isHiding, isShowing } = this.state;
    return classNameHelper({
      base: 'memory-block__wrapper has-transition',
      disappearing: !!isHiding,
      appearing: !!isShowing,
      invisible: !visible,
      visited,
      focus,
    });
  }

  constructSeparateLinePath() {
    return `M ${
      this.original.x + LINKED_LIST_BLOCK_WIDTH - POINTER_HOLDER_WIDTH
    } ${this.original.y} v${LINKED_LIST_BLOCK_HEIGHT}`;
  }

  render() {
    const { value, label } = this.props;

    const valueText = (
      <text
        x={
          this.original.x + (LINKED_LIST_BLOCK_WIDTH - POINTER_HOLDER_WIDTH) / 2
        }
        y={this.original.y + LINKED_LIST_BLOCK_HEIGHT / 2}
        dominantBaseline='middle'
        textAnchor='middle'
        className='memory-block__text'
      >
        {value}
      </text>
    );

    const labelText = label && (
      <text
        x={this.original.x + LINKED_LIST_BLOCK_WIDTH / 2}
        y={this.original.y - LINKED_LIST_BLOCK_HEIGHT / 2}
        dominantBaseline='middle'
        textAnchor='middle'
        className='memory-block__text italic'
      >
        {label}
      </text>
    );

    return (
      <g
        transform={this.produceTransformString()}
        className={this.produceClassName()}
      >
        <rect
          x={this.original.x}
          y={this.original.y}
          width={LINKED_LIST_BLOCK_WIDTH}
          height={LINKED_LIST_BLOCK_HEIGHT}
          className='memory-block__block'
        ></rect>
        <path
          d={this.constructSeparateLinePath()}
          className='memory-block__separate-line'
        />
        {valueText}
        {labelText}
      </g>
    );
  }
}

export default MemoryBlock;
