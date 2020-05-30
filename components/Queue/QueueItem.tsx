import React, { Component } from 'react';
import { pick } from 'lodash';

import { MemoryBlock, AutoTransformGroup } from 'components';
import {
  QUEUE_BLOCK_WIDTH,
  QUEUE_BLOCK_HEIGHT,
  QUEUE_BLOCK_GAP,
} from '../../constants';
import { QueueItemProps, QueueItemState } from './index.d';
import { PointCoordinate } from 'types';
import { classNameHelper } from 'utils';

export class QueueItem extends Component<QueueItemProps, QueueItemState> {
  private initialCoordinate: PointCoordinate;
  constructor(props: QueueItemProps) {
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
      x: x - offsetFromFront * (QUEUE_BLOCK_WIDTH + QUEUE_BLOCK_GAP),
      y: y,
    };
  }

  componentDidUpdate(prevProps: QueueItemProps) {
    const { visible } = this.props;
    if (!visible && prevProps.visible) {
      this.setState({ isAboutToDisappear: true });
    }
  }

  produceClassName() {
    const { isAboutToDisappear } = this.state;
    const { isNew } = this.props;
    return classNameHelper({
      base: 'queue-item__wrapper',
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
          width={QUEUE_BLOCK_WIDTH}
          height={QUEUE_BLOCK_HEIGHT}
          {...this.initialCoordinate}
          {...pick(this.props, ['value'])}
          visible
          type='rectangle'
        />
      </AutoTransformGroup>
    );
  }
}

export default QueueItem;
