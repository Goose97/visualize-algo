import React, { Component } from 'react';

import { MemoryBlock } from 'components';
import { LinkedListMemoryBlockProps } from './index.d';
import {
  LINKED_LIST_BLOCK_WIDTH,
  LINKED_LIST_BLOCK_HEIGHT,
  POINTER_HOLDER_WIDTH,
} from '../../constants';
import { PointCoordinate } from 'types';

export class LinkedListMemoryBlock extends Component<
  LinkedListMemoryBlockProps
> {
  private initialCoordinate: PointCoordinate;
  constructor(props: LinkedListMemoryBlockProps) {
    super(props);

    this.initialCoordinate = {
      x: props.x,
      y: props.y,
    };
  }

  constructSeparateLinePath() {
    const { x, y } = this.initialCoordinate;
    return `M ${
      x + LINKED_LIST_BLOCK_WIDTH - POINTER_HOLDER_WIDTH
    } ${y} v${LINKED_LIST_BLOCK_HEIGHT}`;
  }

  render() {
    return (
      <MemoryBlock
        {...this.props}
        width={LINKED_LIST_BLOCK_WIDTH}
        height={LINKED_LIST_BLOCK_HEIGHT}
        textOffset={{ x: POINTER_HOLDER_WIDTH, y: 0 }}
        x={this.initialCoordinate.x}
        y={this.initialCoordinate.y}
        type='rectangle'
      >
        <path
          d={this.constructSeparateLinePath()}
          className='memory-block__separate-line'
        />
      </MemoryBlock>
    );
  }
}

export default LinkedListMemoryBlock;
