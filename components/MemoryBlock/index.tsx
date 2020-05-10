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
    this.state = {};
    this.original = {
      x: props.x,
      y: props.y,
    };
  }

  componentDidUpdate(prevProps: IProps) {
    const { visible } = this.props;
    if (visible !== prevProps.visible) {
      visible ? this.show() : this.hide();
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
    const { value, label, width, height } = this.props;

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
      <g className={this.produceClassName()}>
        <rect
          x={this.original.x}
          y={this.original.y}
          width={width || LINKED_LIST_BLOCK_WIDTH}
          height={height || LINKED_LIST_BLOCK_HEIGHT}
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
