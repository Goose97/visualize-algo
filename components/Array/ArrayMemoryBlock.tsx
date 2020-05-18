import React, { Component } from 'react';

import { MemoryBlock, AutoTransformGroup } from 'components';
import {
  ARRAY_BLOCK_WIDTH,
  ARRAY_BLOCK_HEIGHT,
  ARRAY_COLUMN_GAP,
  ARRAY_COLUMN_HEIGHT,
  ARRAY_COLUMN_HEIGHT_BASE,
} from '../../constants';
import { ArrayMemoryBlockProps } from './index.d';
import { PointCoordinate } from 'types';

export class ArrayMemoryBlock extends Component<ArrayMemoryBlockProps> {
  private initialCoordinate: PointCoordinate;
  constructor(props: ArrayMemoryBlockProps) {
    super(props);
    this.initialCoordinate = this.calculatePosition();
  }

  calculatePosition() {
    const { index, origin, blockType, value } = this.props;
    const { height } = this.calculateSizeBlock(blockType, value);
    let xPosition = origin.x;
    let yPosition = origin.y;
    switch (blockType) {
      case 'block':
        xPosition = xPosition + ARRAY_BLOCK_WIDTH * index;
        yPosition = yPosition;
        break;
      case 'column':
        xPosition = xPosition + (ARRAY_BLOCK_WIDTH + ARRAY_COLUMN_GAP) * index;
        yPosition = yPosition - height;
        break;
    }
    return {
      x: xPosition,
      y: yPosition,
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
    const { value, visible, focus, visited, label, blockType } = this.props;
    return (
      <AutoTransformGroup origin={this.calculatePosition()}>
        <MemoryBlock
          {...this.initialCoordinate}
          {...this.calculateSizeBlock(blockType, value)}
          value={value}
          visible={visible}
          focus={focus}
          visited={visited}
          label={label}
        />
      </AutoTransformGroup>
    );
  }
}

export default ArrayMemoryBlock;
