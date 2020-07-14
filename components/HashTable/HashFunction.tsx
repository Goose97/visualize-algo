import React, { Component } from 'react';
import { Tooltip } from 'antd';

import { MemoryBlock } from 'components';
import {
  HASH_TABLE_FUNC_WIDTH,
  HASH_TABLE_HASH_FUNC_X,
  ARRAY_BLOCK_HEIGHT,
  HASH_TABLE_UNIVERSAL_KEY_SIZE,
} from '../../constants';

export class HashFunction extends Component {
  render() {
    return (
      <g>
        <Tooltip title='hola'>
          <text
            x={HASH_TABLE_HASH_FUNC_X + HASH_TABLE_FUNC_WIDTH / 2}
            y={-20}
            dominantBaseline='middle'
            textAnchor='middle'
            className='f-big-2 italic'
            id='hash-function-title'
          >
            Hash function
          </text>
        </Tooltip>
        <MemoryBlock
          x={HASH_TABLE_HASH_FUNC_X}
          y={0}
          width={HASH_TABLE_FUNC_WIDTH}
          height={HASH_TABLE_UNIVERSAL_KEY_SIZE * ARRAY_BLOCK_HEIGHT}
          type='rectangle'
          value={null}
          visible
        ></MemoryBlock>
      </g>
    );
  }
}

export default HashFunction;
