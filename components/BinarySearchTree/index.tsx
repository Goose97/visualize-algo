import React, { Component } from 'react';
import { flatMap } from 'lodash';

import { GraphMemoryBlock, PointerLink } from 'components';
import { BSTModel, LevelOrderTraversalQueue, BSTNodeModel } from './index.d';
import {
  caculateTreeHeight,
  caculateChildCoordinate,
  caculatePointerPathFromTwoNodeCenter,
} from './helper';
import { ObjectType, PointCoordinate } from 'types';
import { GRAPH_NODE_RADIUS } from '../../constants';

export class BinarySearchTree extends Component {
  private treeHeight: number;
  private tree: BSTModel;

  constructor(props) {
    super(props);

    this.tree = [
      { value: 1, key: 0, left: 1, right: 2 },
      { value: 2, key: 1, left: 3, right: 4 },
      { value: 3, key: 2, left: 5, right: 6 },
      { value: 4, key: 3, left: 7, right: 8 },
      { value: 5, key: 4, left: 9, right: 10 },
      { value: 6, key: 5, left: 11, right: 12 },
      { value: 7, key: 6, left: null, right: null },
      { value: 8, key: 7, left: null, right: null },
      { value: 9, key: 8, left: null, right: null },
      { value: 10, key: 9, left: null, right: null },
      { value: 11, key: 10, left: null, right: null },
      { value: 12, key: 11, left: null, right: null },
      { value: 13, key: 12, left: null, right: null },
    ];
    this.origin = { x: 400, y: 50 };
    this.treeHeight = caculateTreeHeight(this.tree.length);
  }

  getCoordinationsOfTreeNodes(): ObjectType<PointCoordinate> {
    // Level order traversal tree and caculate
    let result: ObjectType<PointCoordinate> = {};
    let root = { ...this.tree[0], ...this.origin, level: 1 };
    let queue: LevelOrderTraversalQueue = [root];
    while (queue.length) {
      const { key, x, y, left, right, level } = queue.shift()!;
      result[key] = { x, y };
      if (left !== null) {
        const leftChild = this.findNodeInTreeByKey(left);
        queue.push({
          ...leftChild!,
          ...caculateChildCoordinate(
            { x, y },
            level + 1,
            this.treeHeight,
            'left',
          ),
          level: level + 1,
        });
      }

      if (right !== null) {
        const rightChild = this.findNodeInTreeByKey(right);
        queue.push({
          ...rightChild!,
          ...caculateChildCoordinate(
            { x, y },
            level + 1,
            this.treeHeight,
            'right',
          ),
          level: level + 1,
        });
      }
    }

    return result;
  }

  findNodeInTreeByKey(nodeKey: number): BSTNodeModel {
    return this.tree.find(({ key }) => key === nodeKey)!;
  }

  renderTree() {
    const nodeCoordinateByKey = this.getCoordinationsOfTreeNodes();
    return (
      <>
        {this.renderTreeNode(nodeCoordinateByKey)}
        {this.renderPointerLinkForNode(nodeCoordinateByKey)}
      </>
    );
  }

  renderTreeNode(nodeCoordinate: ObjectType<PointCoordinate>) {
    return Object.entries(nodeCoordinate).map(([key, coordinate]) => {
      return (
        <GraphMemoryBlock
          {...coordinate}
          {...this.findNodeInTreeByKey(+key)}
          key={key}
        />
      );
    });
  }

  renderPointerLinkForNode(nodeCoordinate: ObjectType<PointCoordinate>) {
    return flatMap(this.tree, node => {
      const { left, right, key } = node;
      const fromNode = nodeCoordinate[key];
      const from = {
        x: fromNode.x + GRAPH_NODE_RADIUS,
        y: fromNode.y + GRAPH_NODE_RADIUS,
      };
      return [left, right].map(child => {
        if (!child) return null;
        const toNode = nodeCoordinate[child];
        const to = {
          x: toNode.x + GRAPH_NODE_RADIUS,
          y: toNode.y + GRAPH_NODE_RADIUS,
        };
        const pathAndRotation = caculatePointerPathFromTwoNodeCenter(
          from,
          to,
          GRAPH_NODE_RADIUS,
        );

        return (
          <PointerLink
            {...pathAndRotation}
            key={child}
            arrowDirection='right'
          />
        );
      });
    });
  }

  render() {
    return this.renderTree();
  }
}

export default BinarySearchTree;
GRAPH_NODE_RADIUS;
