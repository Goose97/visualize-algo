import React, { Component } from 'react';
import { pick } from 'lodash';

import { MemoryBlock, AutoTransformGroup } from 'components';
import {
  STACK_BLOCK_WIDTH,
  STACK_BLOCK_HEIGHT,
  STACK_BLOCK_GAP,
} from '../../constants';
import { StackItemProps, StackItemState } from './index.d';
import { PointCoordinate } from 'types';
import { classNameHelper } from 'utils';

export class StackItem extends Component<StackItemProps, StackItemState> {
  private initialCoordinate: PointCoordinate;
  constructor(props: StackItemProps) {
    super(props);

    this.initialCoordinate = this.caculateItemCoordinate();
    this.state = {};
  }

  caculateItemCoordinate() {
    const {
      origin: { x, y },
      offsetFromFront,
    } = this.props;
    return {
      x: x,
      y: y - offsetFromFront * (STACK_BLOCK_HEIGHT + STACK_BLOCK_GAP),
    };
  }

  componentDidUpdate(prevProps: StackItemProps) {
    const { visible } = this.props;
    if (!visible && prevProps.visible) {
      this.setState({ isAboutToDisappear: true });
    }
  }

  produceClassName() {
    const { isAboutToDisappear } = this.state;
    const { isNew } = this.props;
    return classNameHelper({
      base: 'stack-item__wrapper',
      disappearing: !!isAboutToDisappear,
      appearing: !!isNew,
    });
  }

  render() {
    return (
      <AutoTransformGroup
        origin={this.caculateItemCoordinate()}
        className={this.produceClassName()}
      >
        <MemoryBlock
          width={STACK_BLOCK_WIDTH}
          height={STACK_BLOCK_HEIGHT}
          {...this.initialCoordinate}
          value={this.props.value}
          visible
          type='rectangle'
        />
      </AutoTransformGroup>
    );
  }
}

export default StackItem;
