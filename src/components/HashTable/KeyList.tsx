import React, { Component } from 'react';

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
    return hashTableModel.keys.reduce((acc, { key }, index) => {
      const y = (HASH_TABLE_KEYS_HEIGHT + 10) * index;
      return { ...acc, [key]: y };
    }, {});
  }

  getInitialYCoordinate(key: string) {
    const { hashTableModel } = this.props;
    const valueInCache = this.initialYCoordinationOfKeys[key];
    if (valueInCache != undefined) return valueInCache;
    const keyIndex = hashTableModel.keys.findIndex(
      ({ key: nodeKey }) => key === nodeKey,
    )!;
    const value = (HASH_TABLE_KEYS_HEIGHT + 10) * keyIndex;
    this.initialYCoordinationOfKeys[key] = value;
    return value;
  }

  renderListKeyBlock() {
    const { hashTableModel } = this.props;
    const shouldHighlightKeys = this.getShouldHighlightKeys();
    return hashTableModel.keys.map(({ key, isNew }, index) => {
      const y = (HASH_TABLE_KEYS_HEIGHT + 10) * index;
      return (
        <AutoTransformGroup
          origin={{ x: 0, y }}
          key={key}
          className='long-transition'
        >
          <MemoryBlock
            x={0}
            y={this.getInitialYCoordinate(key)}
            width={HASH_TABLE_KEYS_WIDTH}
            height={HASH_TABLE_KEYS_HEIGHT}
            type='rectangle'
            value={key}
            visible
            isNew={isNew}
            // Highlight one key also means blur every other keys
            blur={
              shouldHighlightKeys.length
                ? !shouldHighlightKeys.includes(key)
                : false
            }
          />
        </AutoTransformGroup>
      );
    });
  }

  getShouldHighlightKeys() {
    const { hashTableModel } = this.props;
    return hashTableModel.keys
      .filter(({ highlight }) => highlight)
      .map(({ key }) => key);
  }

  render() {
    return (
      <g className='hash-table-key-list__wrapper'>
        <text
          x={HASH_TABLE_KEYS_WIDTH / 2}
          y={-20}
          dominantBaseline='middle'
          textAnchor='middle'
          className='f-big-2 has-transition italic'
        >
          Keys
        </text>
        {this.renderListKeyBlock()}
      </g>
    );
  }
}

export default KeyList;
