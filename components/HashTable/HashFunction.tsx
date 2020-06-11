import React, { Component } from 'react';

import { MemoryBlock } from 'components';
import {
  HASH_TABLE_KEYS_WIDTH,
  HASH_TABLE_FUNC_HEIGHT,
  HASH_TABLE_FUNC_WIDTH,
} from '../../constants';

export class HashFunction extends Component {
  render() {
    return (
      <MemoryBlock
        x={HASH_TABLE_KEYS_WIDTH * 3}
        y={0}
        width={HASH_TABLE_FUNC_WIDTH}
        height={HASH_TABLE_FUNC_HEIGHT}
        type='rectangle'
        value={null}
        label={['Hash function']}
        visible
      ></MemoryBlock>
    );
  }
}

export default HashFunction;
