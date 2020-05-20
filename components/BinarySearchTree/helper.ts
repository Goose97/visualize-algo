import { pick } from 'lodash';

import {
  TREE_LIKE_LEVEL_GAP,
  BST_CHILD_DISTANCE_FROM_PARENT,
  GRAPH_NODE_RADIUS,
} from '../../constants';
import { PointCoordinate } from 'types';
import { BSTModel } from './index.d';

export const caculateTreeHeight = (totalNodeCount: number) => {
  return Math.floor(Math.log2(totalNodeCount)) + 1;
};

export const isNodeCoordinateCollideWithOtherNode = (
  nodeCoordinate: PointCoordinate,
  currentModel: BSTModel,
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

export const caculatePointerPathFromTwoNodeCenter = (
  nodeACenter: PointCoordinate,
  nodeBCenter: PointCoordinate,
  radius: number,
) => {
  const angle = caculateAngleOfLine(nodeACenter, nodeBCenter);
  const contactPointWithA = {
    x: nodeACenter.x + Math.cos(angle) * radius,
    y: nodeACenter.y + Math.sin(angle) * radius,
  };

  // const contactPointWithB = {
  //   x: nodeBCenter.x - Math.cos(angle) * radius,
  //   y: nodeBCenter.y - Math.sin(angle) * radius,
  // };

  const length =
    caculateLength(nodeACenter, nodeBCenter) - 2 * GRAPH_NODE_RADIUS;
  const offsetForArrow = 6;
  const path = `M ${contactPointWithA.x} ${contactPointWithA.y} h ${
    length - offsetForArrow
  }`;
  const transform = `rotate(${(angle / Math.PI) * 180} ${contactPointWithA.x} ${
    contactPointWithA.y
  })`;
  return { path, transform };
};

const caculateLength = (pointA: PointCoordinate, pointB: PointCoordinate) => {
  return Math.sqrt((pointA.x - pointB.x) ** 2 + (pointA.y - pointB.y) ** 2);
};

const caculateAngleOfLine = (
  start: PointCoordinate,
  finish: PointCoordinate,
) => {
  const deltaX = finish.x - start.x;
  const deltaY = finish.y - start.y;
  let tan = deltaY / deltaX;
  if (finish.x >= start.x) {
    return Math.atan(tan);
  } else {
    return Math.atan(tan) > 0
      ? Math.atan(tan) - Math.PI
      : Math.atan(tan) + Math.PI;
  }
};
