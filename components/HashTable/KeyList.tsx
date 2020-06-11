import React, { Component } from 'react';

import { MemoryBlock } from 'components';
import { KeyListProps } from './index.d';
import { HASH_TABLE_KEYS_WIDTH, HASH_TABLE_KEYS_HEIGHT } from '../../constants';

export class KeyList extends Component<KeyListProps> {
  renderListKeyBlock() {
    const { hashTableModel } = this.props;
    return hashTableModel.map(({ key }, index) => {
      const y = (HASH_TABLE_KEYS_HEIGHT + 10) * index;
      return (
        <MemoryBlock
          x={0}
          y={y}
          width={HASH_TABLE_KEYS_WIDTH}
          height={HASH_TABLE_KEYS_HEIGHT}
          type='rectangle'
          value={key}
          label={index === 0 ? ['Keys'] : undefined}
          visible
        />
      );
    });
  }

  render() {
    return this.renderListKeyBlock();
  }
}

export default KeyList;
