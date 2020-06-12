import React, { Component } from 'react';

import { MemoryBlock } from 'components';
import {
  HASH_TABLE_FUNC_WIDTH,
  HASH_TABLE_HASH_FUNC_X,
  ARRAY_BLOCK_HEIGHT,
  HASH_TABLE_UNIVERSAL_KEY_SIZE,
} from '../../constants';

export class HashFunction extends Component {
  render() {
    const {} = this.props;
    return (
      <MemoryBlock
        x={HASH_TABLE_HASH_FUNC_X}
        y={0}
        width={HASH_TABLE_FUNC_WIDTH}
        height={HASH_TABLE_UNIVERSAL_KEY_SIZE * ARRAY_BLOCK_HEIGHT}
        type='rectangle'
        value={null}
        label={['Hash function']}
        visible
      ></MemoryBlock>
    );
  }
}

export default HashFunction;
