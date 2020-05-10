import React, { Component } from 'react';

import { PointerLink } from 'components';
import {
  LINKED_LIST_BLOCK_WIDTH,
  LINKED_LIST_BLOCK_HEIGHT,
} from '../../constants';
import { LinkedListPointerProps } from './index.d';

class LinkedListPointer extends Component<LinkedListPointerProps> {
  caculatePathOfPointer() {
    const { linkedListModel, nodeAboutToAppear, from, to } = this.props;
    let { x, y, visible } = linkedListModel.find(({ key }) => key === from)!;
    if (!to || !visible) return null;

    let { x: x1, y: y1 } = linkedListModel.find(({ key }) => key === to)!;
    if (this.isFromBehindTo()) {
      const start = {
        x: x + LINKED_LIST_BLOCK_WIDTH - 10,
        y: y + LINKED_LIST_BLOCK_HEIGHT / 2,
      };
      let finish;
      if (nodeAboutToAppear.has(from)) {
        finish = { ...start };
      } else {
        finish = { x: x1, y: y1 + LINKED_LIST_BLOCK_HEIGHT / 2 };
      }

      return `M ${start.x} ${start.y} L ${finish.x - 12} ${finish.y}`;
    } else {
      const start = {
        x: x,
        y: y + LINKED_LIST_BLOCK_HEIGHT / 2,
      };
      let finish;
      if (nodeAboutToAppear.has(from)) {
        finish = { ...start };
      } else {
        finish = {
          x: x1 + LINKED_LIST_BLOCK_WIDTH,
          y: y1 + LINKED_LIST_BLOCK_HEIGHT / 2,
        };
      }

      return `M ${start.x} ${start.y} L ${finish.x - 12} ${finish.y}`;
    }
  }

  isFromBehindTo() {
    const { from, to, linkedListModel } = this.props;
    const fromNode = linkedListModel.findIndex(({ key }) => key === from);
    const toNode = linkedListModel.findIndex(({ key }) => key === to);
    return fromNode < toNode;
  }

  render() {
    const path = this.caculatePathOfPointer();
    return (
      path && <PointerLink {...this.props} path={path} arrowDirection='right' />
    );
  }
}

export default LinkedListPointer;
