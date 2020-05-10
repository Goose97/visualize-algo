import React, { Component } from 'react';

import { MemoryBlock } from 'components';
import { ARRAY_BLOCK_WIDTH, ARRAY_BLOCK_HEIGHT } from '../../constants';
import { ArrayMemoryBlockProps } from './index.d';

export class ArrayMemoryBlock extends Component<ArrayMemoryBlockProps> {
  caculatePosition() {
    const { index, origin } = this.props;
    return {
      x: origin.x + ARRAY_BLOCK_WIDTH * index,
      y: origin.y,
    };
  }

  render() {
    return (
      <rect
        {...this.caculatePosition()}
        width={ARRAY_BLOCK_WIDTH}
        height={ARRAY_BLOCK_HEIGHT}
        className='memory-block__block'
        style={{ fill: 'none', stroke: 'black' }}
      ></rect>
    );
  }
}

export default ArrayMemoryBlock;
