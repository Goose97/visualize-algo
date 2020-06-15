import React, { Component } from 'react';
import { pick } from 'lodash';

import { MemoryBlock } from 'components';
import { KeyListProps } from './index.d';
import { HASH_TABLE_KEYS_WIDTH, HASH_TABLE_KEYS_HEIGHT } from '../../constants';
import { AutoTransformGroup } from 'components';
import { ObjectType } from 'types';

class KeyList extends Component<KeyListProps> {
  private initialYCoordinationOfKeys: ObjectType<number>;
  constructor(props: KeyListProps) {
    super(props);
    this.initialYCoordinationOfKeys = this.produceInitialKeyYCoordination();
  }

  produceInitialKeyYCoordination() {
    const { hashTableModel } = this.props;
    return hashTableModel.reduce((acc, { key }, index) => {
      const y = (HASH_TABLE_KEYS_HEIGHT + 10) * index;
      return { ...acc, [key]: y };
    }, {});
  }

  renderListKeyBlock() {
    const { hashTableModel } = this.props;
    return hashTableModel.map(({ key, isNew }, index) => {
      const y = (HASH_TABLE_KEYS_HEIGHT + 10) * index;
      return (
        <AutoTransformGroup
          origin={{ x: 0, y }}
          key={key}
          className='long-transition'
        >
          <MemoryBlock
            x={0}
            y={this.initialYCoordinationOfKeys[key]}
            width={HASH_TABLE_KEYS_WIDTH}
            height={HASH_TABLE_KEYS_HEIGHT}
            type='rectangle'
            value={key}
            label={index === 0 ? ['Keys'] : undefined}
            visible
            isNew={isNew}
          />
        </AutoTransformGroup>
      );
    });
  }

  render() {
    return this.renderListKeyBlock();
  }
}

export default KeyList;
