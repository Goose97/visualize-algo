import React, { Component } from 'react';

import { PointerLink } from 'components';
import {
  LINKED_LIST_BLOCK_WIDTH,
  LINKED_LIST_BLOCK_HEIGHT,
} from '../../constants';
import { LinkedListPointerProps } from './index.d';

class LinkedListPointer extends Component<LinkedListPointerProps> {
  caculateStartAndFinishOfPointer() {
    const { linkedListModel, nodeAboutToAppear, from, to } = this.props;
    let { x, y, visible } = linkedListModel.find(({ key }) => key === from)!;
    if (this.isFromBehindTo()) {
      const start = {
        x: x + LINKED_LIST_BLOCK_WIDTH - 10,
        y: y + LINKED_LIST_BLOCK_HEIGHT / 2,
      };
      let finish;
      if (to && visible) {
        let { x: x1, y: y1 } = linkedListModel.find(({ key }) => key === to)!;

        if (nodeAboutToAppear.has(from)) {
          finish = { ...start };
        } else {
          finish = { x: x1, y: y1 + LINKED_LIST_BLOCK_HEIGHT / 2 };
        }
        console.log('start', start);
        console.log('finish', finish);
        return { start, finish };
        // return `M ${start.x} ${start.y} L ${finish.x - 10} ${finish.y}`;
      } else {
        return null;
      }
    } else {
    }
  }

  isFromBehindTo() {
    const { from, to, linkedListModel } = this.props;
    const fromNode = linkedListModel.findIndex(({ key }) => key === from);
    const toNode = linkedListModel.findIndex(({ key }) => key === to);
    return fromNode < toNode;
  }

  render() {
    const startAndFinish = this.caculateStartAndFinishOfPointer();
    return (
      startAndFinish && <PointerLink {...startAndFinish} {...this.props} />
    );
  }
}

export default LinkedListPointer;
