import React, { Component } from 'react';
import { pick } from 'lodash';

import { MemoryBlock, AutoTransformGroup } from 'components';
import { LinkedListMemoryBlockProps } from './index.d';
import {
  LINKED_LIST_BLOCK_WIDTH,
  LINKED_LIST_BLOCK_HEIGHT,
  POINTER_HOLDER_WIDTH,
} from '../../constants';
import { PointCoordinate } from 'types';
import { classNameHelper } from 'utils';

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

  produceClassName() {
    const { isNew } = this.props;
    return classNameHelper({
      base: 'linked-list-block__wrapper',
      appearing: !!isNew,
    });
  }

  render() {
    return (
      <AutoTransformGroup
        origin={pick(this.props, ['x', 'y'])}
        className={this.produceClassName()}
      >
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
      </AutoTransformGroup>
    );
  }
}

export default LinkedListMemoryBlock;
