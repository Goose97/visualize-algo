import React, { Component } from 'react';

import { MemoryBlock, LinkedListDS, PointerLink } from 'components';
import { caculateKeyHash } from './helper';
import {
  HASH_TABLE_UNIVERSAL_KEY_SIZE,
  ARRAY_BLOCK_WIDTH,
  ARRAY_BLOCK_HEIGHT,
  HASH_TABLE_ARRAY_X,
} from '../../constants';
import { MemoryArrayProps } from './index.d';
import { ObjectType } from 'types';

export class MemoryArray extends Component<MemoryArrayProps> {
  renderListMemoryBlock() {
    return (
      <g className='hash-table__memory-blocks'>
        {Array(HASH_TABLE_UNIVERSAL_KEY_SIZE)
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
          })}
      </g>
    );
  }

  renderLinkedListInEachBlock() {
    const valuesInArrayAddress = this.getArrayAddressValuesMap();
    return Object.entries(valuesInArrayAddress).map(([address, values]) => {
      return (
        <g key={address}>
          {this.renderPointerLinkToLinkedList(+address)}
          <LinkedListDS
            key={address}
            x={HASH_TABLE_ARRAY_X + ARRAY_BLOCK_WIDTH + 50}
            y={+address * ARRAY_BLOCK_HEIGHT + 5}
            instructions={[]}
            data={values.map(({ value }) => value)}
            controlled
          />
        </g>
      );
    });
  }

  renderPointerLinkToLinkedList(address: number) {
    return (
      <PointerLink
        path={`M ${HASH_TABLE_ARRAY_X + ARRAY_BLOCK_WIDTH / 2} ${
          +address * ARRAY_BLOCK_HEIGHT + ARRAY_BLOCK_HEIGHT / 2
        } H ${HASH_TABLE_ARRAY_X + ARRAY_BLOCK_WIDTH + 50 - 6}`}
        arrowDirection='right'
      />
    );
  }

  getArrayAddressValuesMap(): ObjectType<
    { key: string; value: number | string }[]
  > {
    const { hashTableModel } = this.props;
    return hashTableModel.reduce<
      ObjectType<{ key: string; value: number | string }[]>
    >((acc, { key, value, isNew }) => {
      const hash = caculateKeyHash(key, HASH_TABLE_UNIVERSAL_KEY_SIZE);
      if (isNew) return acc;

      if (acc[hash]) {
        acc[hash].push({ key, value });
      } else {
        acc[hash] = [{ key, value }];
      }

      return acc;
    }, {});
  }

  render() {
    return (
      <g>
        {this.renderListMemoryBlock()}
        {this.renderLinkedListInEachBlock()}
      </g>
    );
  }
}

export default MemoryArray;
