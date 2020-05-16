import React, { Component } from 'react';

import { MemoryBlock, AutoTransformGroup } from 'components';
import { ARRAY_BLOCK_WIDTH, ARRAY_BLOCK_HEIGHT } from '../../constants';
import { ArrayMemoryBlockProps } from './index.d';
import { PointCoordinate } from 'types';

export class ArrayMemoryBlock extends Component<ArrayMemoryBlockProps> {
  private initialCoordinate: PointCoordinate;
  constructor(props: ArrayMemoryBlockProps) {
    super(props);
    this.initialCoordinate = this.caculatePosition();
  }

  caculatePosition() {
    const { index, origin } = this.props;
    return {
      x: origin.x + ARRAY_BLOCK_WIDTH * index,
      y: origin.y,
    };
  }

  render() {
    const { value, visible, focus, visited, label } = this.props;
    return (
      <AutoTransformGroup origin={this.caculatePosition()}>
        <MemoryBlock
          {...this.initialCoordinate}
          width={ARRAY_BLOCK_WIDTH}
          height={ARRAY_BLOCK_HEIGHT}
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
