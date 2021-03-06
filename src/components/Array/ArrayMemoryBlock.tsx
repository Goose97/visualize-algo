import React, { Component } from 'react';
import { pick } from 'lodash';

import { MemoryBlock, AutoTransformGroup } from 'components';
import {
  ARRAY_BLOCK_WIDTH,
  ARRAY_BLOCK_HEIGHT,
  ARRAY_COLUMN_GAP,
  ARRAY_COLUMN_HEIGHT,
  ARRAY_COLUMN_HEIGHT_BASE,
  LINE_HEIGHT,
} from '../../constants';
import { ArrayMemoryBlockProps } from './index.d';
import { PointCoordinate } from 'types';

class ArrayMemoryBlock extends Component<ArrayMemoryBlockProps> {
  private initialCoordinate: PointCoordinate;
  constructor(props: ArrayMemoryBlockProps) {
    super(props);
    this.initialCoordinate = this.calculatePosition();
  }

  calculatePosition() {
    const { index, blockType, value, isInsertionSorting } = this.props;
    const { height } = this.calculateSizeBlock(
      blockType,
      this.parseValueToNumber(value),
    );
    let xPosition = 0;
    let yPosition = isInsertionSorting ? 100 : 0;
    switch (blockType) {
      case 'block':
        xPosition = ARRAY_BLOCK_WIDTH * index;
        break;
      case 'column':
        xPosition = (ARRAY_BLOCK_WIDTH + ARRAY_COLUMN_GAP) * index;
        yPosition = -height;
        break;
    }
    return {
      x: xPosition,
      y: yPosition,
    };
  }

  parseValueToNumber(value: number | string | null) {
    if (!value) return 0;
    if (typeof value === 'string') return parseInt(value);
    return value;
  }

  calculateLine() {
    const { index } = this.props;
    let x1, y1, x2, y2;
    x1 = ARRAY_BLOCK_WIDTH * (index + 1);
    y1 = ARRAY_BLOCK_HEIGHT + LINE_HEIGHT;
    x2 = x1;
    y2 = -LINE_HEIGHT;
    return {
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
    };
  }

  calculateSizeBlock(blockType: string, value: number) {
    let height = 0;
    switch (blockType) {
      case 'block':
        height = ARRAY_BLOCK_HEIGHT;
        break;
      case 'column':
        height = ARRAY_COLUMN_HEIGHT * value + ARRAY_COLUMN_HEIGHT_BASE;
        break;
    }
    return {
      width: ARRAY_BLOCK_WIDTH,
      height,
    };
  }

  render() {
    const { value, visible, blockType } = this.props;
    const propsToPass = [
      'focus',
      'visited',
      'label',
      'className',
      'highlight',
      'blur',
      'transform',
      'labelDirection',
    ];
    
    return (
      <AutoTransformGroup origin={this.calculatePosition()}>
        <MemoryBlock
          {...this.initialCoordinate}
          {...this.calculateSizeBlock(
            blockType,
            this.parseValueToNumber(value),
          )}
          type='rectangle'
          {...pick(this.props, propsToPass)}
          visible={!!visible}
          value={value}
        />
      </AutoTransformGroup>
    );
  }
}

export default ArrayMemoryBlock;
