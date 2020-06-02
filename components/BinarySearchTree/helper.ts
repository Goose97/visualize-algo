import { pick } from 'lodash';

import {
  TREE_LIKE_LEVEL_GAP,
  BST_CHILD_DISTANCE_FROM_PARENT,
  GRAPH_NODE_RADIUS,
} from '../../constants';
import { PointCoordinate } from 'types';
import { BinaryTreeNode } from 'instructions/BST/helper';
import { BST } from 'types/ds/BST';

// Also included null node
export const caculateTreeHeight = (
  bstModel: Omit<BST.NodeModel, 'x' | 'y'>[],
) => {
  if (!bstModel.length) return 0;

  let biggestLevel = 0;
  const findNodeByKey = (nodeKey: number) =>
    bstModel.find(({ key }) => key === nodeKey);
  let stack: any[] = [{ node: bstModel[0], level: 1 }];
  // Do DFS to find tree height
  while (stack.length) {
    const {
      node: { left, right },
      level,
    } = stack.pop();
    biggestLevel = Math.max(biggestLevel, level);
    const leftChild = findNodeByKey(left);
    const rightChild = findNodeByKey(right);
    if (leftChild) stack.push({ node: leftChild, level: level + 1 });
    if (rightChild) stack.push({ node: rightChild, level: level + 1 });
  }

  return biggestLevel;
};

export const isNodeCoordinateCollideWithOtherNode = (
  nodeCoordinate: PointCoordinate,
  currentModel: BST.Model,
) => {
  const isIntersect = (
    nodeCoordinateA: PointCoordinate,
    nodeCoordinateB: PointCoordinate,
  ) => {
    // If distance from A to B smaller than 2 * node radius then they are intersect
    const distance = Math.sqrt(
      (nodeCoordinateA.x - nodeCoordinateB.x) ** 2 +
        (nodeCoordinateA.y - nodeCoordinateB.y) ** 2,
    );
    return distance < 2 * GRAPH_NODE_RADIUS;
  };

  return currentModel.some(node =>
    isIntersect(nodeCoordinate, pick(node, ['x', 'y'])),
  );
};

const caculateTreeWidthBasedOnHeight = (treeHeight: number): number => {
  if (treeHeight === 2) return BST_CHILD_DISTANCE_FROM_PARENT * 2;
  return caculateTreeWidthBasedOnHeight(treeHeight - 1) * 2 + 100;
};

const caculateChildDistanceFromParentBasedOnLevel = (
  level: number,
  treeHeight: number,
): number => {
  if (level === treeHeight) {
    const subTreeWidth = caculateTreeWidthBasedOnHeight(2);
    return subTreeWidth / 2;
  } else {
    const subTreeWidth = caculateTreeWidthBasedOnHeight(treeHeight - level + 1);
    return subTreeWidth / 2 + 40;
  }
};

export const caculateChildCoordinate = (
  parentCoordinate: PointCoordinate,
  level: number,
  treeHeight: number,
  leftOrRight: 'left' | 'right',
): PointCoordinate => {
  const { x, y } = parentCoordinate;
  const distanceFromParentBasedOnLevel = caculateChildDistanceFromParentBasedOnLevel(
    level,
    treeHeight,
  );

  return {
    x: x + (leftOrRight === 'left' ? -1 : 1) * distanceFromParentBasedOnLevel,
    y: y + TREE_LIKE_LEVEL_GAP,
  };
};

export const produceInitialBSTData = (
  array: Array<number | null> | Array<string | null>,
): Omit<BST.NodeModel, 'x' | 'y'>[] => {
  if (!array.length) return [];
  let queue: Omit<BST.NodeModel, 'x' | 'y'>[] = [];
  let result: Omit<BST.NodeModel, 'x' | 'y'>[] = [];
  let counter = 0;
  for (let i = 0; i < array.length; i++) {
    let val = array[i];
    let parentNode = queue[0];

    const newNode = val !== null ? new BinaryTreeNode(val, i) : null;
    if (newNode)
      queue.push({
        key: newNode!.key,
        value: newNode!.val,
        left: null,
        right: null,
      });

    if (parentNode) {
      if (counter === 0) {
        // this node is left of parent node
        parentNode.left = newNode ? newNode.key : null;
        counter++;
      } else {
        // this node is right of parent node
        parentNode.right = newNode ? newNode.key : null;
        counter = 0;
        result.push(queue.shift()!);
      }
    }
  }

  result.push(...queue);

  return result;
};