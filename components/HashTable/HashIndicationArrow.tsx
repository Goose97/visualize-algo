import React, { Component } from 'react';

import { PointerLink } from 'components';
import { HashIndicationArrowProps } from './index.d';
import { caculateKeyHash } from './helper';
import {
  HASH_TABLE_KEYS_HEIGHT,
  HASH_TABLE_KEYS_WIDTH,
  HASH_TABLE_HASH_FUNC_X,
  HASH_TABLE_ARRAY_X,
  ARRAY_BLOCK_HEIGHT,
  HASH_TABLE_FUNC_WIDTH,
  HASH_TABLE_UNIVERSAL_KEY_SIZE,
} from '../../constants';

export class HashIndicationArrow extends Component<HashIndicationArrowProps> {
  renderArrowIndicateHashForKey() {
    const {
      hashTableModel,
      onAnimationEnd,
      keyAboutToBeDeleted,
      keyAboutToBeAdded,
    } = this.props;
    const keyToHighlight = keyAboutToBeDeleted.concat(keyAboutToBeAdded);
    return [...hashTableModel]
      .sort(({ key: keyA }, { key: keyB }) => {
        // We sort so the key which are about to be deleted will be paint later
        // so the highlight arrow will be easier to see
        const pointA = keyToHighlight.includes(keyA) ? 1 : 0;
        const pointB = keyToHighlight.includes(keyB) ? 1 : 0;
        return pointA - pointB;
      })
      .map(({ key, isNew }, index) => {
        const hash = caculateKeyHash(key, HASH_TABLE_UNIVERSAL_KEY_SIZE);
        const memoryLocationYCoordinate = (hash + 0.5) * ARRAY_BLOCK_HEIGHT;
        // The path can be divided into three part
        // 1 - Move to hash funtion
        // 2 - Move inside hash function
        // 3 - Reach memory block
        const moveToHashFunction = `M ${HASH_TABLE_KEYS_WIDTH} ${
          (index + 0.5) * HASH_TABLE_KEYS_HEIGHT + index * 10
        } H ${HASH_TABLE_HASH_FUNC_X}`;
        const moveInsideHashFunction = `L ${
          HASH_TABLE_HASH_FUNC_X + HASH_TABLE_FUNC_WIDTH
        } ${memoryLocationYCoordinate}`;
        const reachMemoryBlock = `H ${HASH_TABLE_ARRAY_X - 50}`;
        const path = [
          moveToHashFunction,
          moveInsideHashFunction,
          reachMemoryBlock,
        ].join(' ');

        return (
          <PointerLink
            path={path}
            key={key}
            arrowDirection='right'
            isNew={!!isNew}
            animationDuration='2s'
            onAnimationEnd={(animationName: string) =>
              onAnimationEnd(key, animationName)
            }
            highlight={keyToHighlight.includes(key)}
          />
        );
      });
  }

  render() {
    return this.renderArrowIndicateHashForKey();
  }
}

export default HashIndicationArrow;
