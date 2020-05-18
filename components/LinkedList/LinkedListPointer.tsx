import React, { Component } from 'react';
import { pick } from 'lodash';

import { PointerLink } from 'components';
import {
  LINKED_LIST_BLOCK_WIDTH,
  LINKED_LIST_BLOCK_HEIGHT,
  LINKED_LIST_CORNER_RADIUS,
} from '../../constants';
import { LinkedListPointerProps } from './index.d';

const OFFSET_FOR_ARROW = 7;

class LinkedListPointer extends Component<LinkedListPointerProps> {
  constructor(props: LinkedListPointerProps) {
    super(props);
  }

  caculatePathOfPointer() {
    const { linkedListModel, nodeAboutToAppear, from, to } = this.props;
    let { x, y, visible } = linkedListModel.find(({ key }) => key === from)!;
    if (typeof to !== 'number' || !visible) return null;

    let { x: x1, y: y1 } = linkedListModel.find(({ key }) => key === to)!;
    const indexDistance = this.fromAndToIndexDistance();
    const startFromTailOfFromNode = {
      x: x + LINKED_LIST_BLOCK_WIDTH - 10,
      y: y + LINKED_LIST_BLOCK_HEIGHT / 2,
    };

    const startFromHeadOfFromNode = {
      x: x,
      y: y + LINKED_LIST_BLOCK_HEIGHT / 2,
    };

    // One node ahead
    if (indexDistance === 1) {
      const start = { ...startFromTailOfFromNode };
      let finish;
      if (nodeAboutToAppear.has(from)) {
        finish = { ...start };
      } else {
        finish = { x: x1, y: y1 + LINKED_LIST_BLOCK_HEIGHT / 2 };
      }

      return `M ${start.x} ${start.y} L ${finish.x - OFFSET_FOR_ARROW} ${
        finish.y
      }`;
    }

    // One node behind
    if (indexDistance === -1) {
      const start = {
        ...startFromHeadOfFromNode,
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

      return `M ${start.x} ${start.y} L ${finish.x + OFFSET_FOR_ARROW} ${
        finish.y
      }`;
    }

    // Many node behind
    if (indexDistance < -1) {
      const start = { ...startFromTailOfFromNode };
      let finish;
      if (nodeAboutToAppear.has(from)) {
        finish = { ...start };
      } else {
        finish = {
          x: x1 + LINKED_LIST_BLOCK_WIDTH / 2,
          y: y1 + LINKED_LIST_BLOCK_HEIGHT,
        };
      }

      return `M ${start.x} ${start.y} h 40 ${this.caculateRoundCornerPath(
        2,
      )} v 92 ${this.caculateRoundCornerPath(3)} H ${
        finish.x + LINKED_LIST_CORNER_RADIUS
      } ${this.caculateRoundCornerPath(4)} V ${finish.y + OFFSET_FOR_ARROW}`;
    }
  }

  // 1 ------ 2
  // ----------
  // ----------
  // 4 ------ 3
  caculateRoundCornerPath(cornerNumber: number) {
    switch (cornerNumber) {
      case 1:
        return `a ${LINKED_LIST_CORNER_RADIUS} ${LINKED_LIST_CORNER_RADIUS} 135 0 1 ${LINKED_LIST_CORNER_RADIUS} ${-LINKED_LIST_CORNER_RADIUS}`;
      case 2:
        return `a ${LINKED_LIST_CORNER_RADIUS} ${LINKED_LIST_CORNER_RADIUS} 135 0 1 ${LINKED_LIST_CORNER_RADIUS} ${LINKED_LIST_CORNER_RADIUS}`;
      case 3:
        return `a ${LINKED_LIST_CORNER_RADIUS} ${LINKED_LIST_CORNER_RADIUS} -135 0 1 ${-LINKED_LIST_CORNER_RADIUS} ${LINKED_LIST_CORNER_RADIUS}`;
      case 4:
        return `a ${LINKED_LIST_CORNER_RADIUS} ${LINKED_LIST_CORNER_RADIUS} -135 0 1 ${-LINKED_LIST_CORNER_RADIUS} ${-LINKED_LIST_CORNER_RADIUS}`;
    }
  }

  // We ignore the node which is not visible anymore
  fromAndToIndexDistance() {
    const { from, to, linkedListModel } = this.props;
    const fromNode = linkedListModel.findIndex(({ key }) => key === from);
    const toNode = linkedListModel.findIndex(({ key }) => key === to);

    let nodeInBetween;
    if (fromNode < toNode)
      nodeInBetween = linkedListModel.slice(fromNode + 1, toNode);
    else nodeInBetween = linkedListModel.slice(toNode + 1, fromNode);
    return (
      (nodeInBetween.filter(({ visible }) => visible).length + 1) *
      (fromNode < toNode ? 1 : -1)
    );
  }

  getArrowDirection() {
    const distance = this.fromAndToIndexDistance();
    if (distance === 1) return 'right';
    if (distance === -1) return 'left';
    if (distance > 1) return 'down';
    if (distance < -1) return 'up';
  }

  render() {
    const path = this.caculatePathOfPointer();
    const propsToPass = pick(this.props, ['following', 'visited', 'visible']);
    return path ? (
      <PointerLink
        {...propsToPass}
        path={path}
        arrowDirection={this.getArrowDirection()}
      />
    ) : null;
  }
}

export default LinkedListPointer;
