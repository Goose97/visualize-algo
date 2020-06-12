import React, { Component } from 'react';

import { MemoryBlock } from 'components';
import {
  HASH_TABLE_ARRAY_SIZE,
  ARRAY_BLOCK_WIDTH,
  ARRAY_BLOCK_HEIGHT,
  HASH_TABLE_ARRAY_X,
} from '../../constants';
import { MemoryArrayProps } from './index.d';

export class MemoryArray extends Component<MemoryArrayProps> {
  renderListMemoryBlock() {
    return Array(HASH_TABLE_ARRAY_SIZE)
      .fill(0)
      .map((_, index) => {
        return (
          <MemoryBlock
            key={index}
            width={ARRAY_BLOCK_WIDTH}
            height={ARRAY_BLOCK_HEIGHT}
            x={HASH_TABLE_ARRAY_X}
            y={index * ARRAY_BLOCK_HEIGHT}
            value={null}
            visible
            type='rectangle'
            labelDirection='left'
            label={[index.toString()]}
          />
        );
      });
  }

  render() {
    return this.renderListMemoryBlock();
  }
}

export default MemoryArray;
