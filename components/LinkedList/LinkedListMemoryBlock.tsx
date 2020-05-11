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
  private original: PointCoordinate;
  constructor(props: LinkedListMemoryBlockProps) {
    super(props);

    this.original = {
      x: props.x,
      y: props.y,
    };
  }

  constructSeparateLinePath() {
    const { x, y } = this.original;
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
        x={this.original.x}
        y={this.original.y}
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
