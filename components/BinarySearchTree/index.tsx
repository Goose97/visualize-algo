import React, { Component } from 'react';
import { flatMap, pick, isEqual } from 'lodash';

import { GraphMemoryBlock, PointerLink } from 'components';
import {
  IProps,
  IState,
  BSTModel,
  LevelOrderTraversalQueue,
  BSTNodeModel,
  BSTMethod,
} from './index.d';
import transformBSTModel from './ModelTransformer';
import withReverseStep, { WithReverseStep } from 'hocs/withReverseStep';
import { getProgressDirection, keyExist } from 'utils';
import {
  caculateTreeHeight,
  caculateChildCoordinate,
  caculatePointerPathFromTwoNodeCenter,
  isNodeCoordinateCollideWithOtherNode,
  produceInitialBSTData,
} from './helper';
import { ObjectType, PointCoordinate, Action } from 'types';
import { GRAPH_NODE_RADIUS } from '../../constants';

type PropsWithHoc = IProps & WithReverseStep<BSTModel>;

export class BinarySearchTree extends Component<PropsWithHoc, IState> {
  constructor(props: PropsWithHoc) {
    super(props);
    this.state = {
      nodeAboutToVisit: new Set([]),
      bstModel: this.initBSTModel(),
    };
  }

  initBSTModel() {
    const { initialData } = this.props;
    // const bstModelWithoutCoordinate = [
    //   { value: 4, key: 0, left: 1, right: 2 },
    //   { value: 1, key: 1, left: 3, right: 4 },
    //   { value: 8, key: 2, left: 5, right: 6 },
    //   { value: 0, key: 3, left: null, right: null },
    //   { value: 2, key: 4, left: null, right: null },
    //   { value: 6, key: 5, left: null, right: null },
    //   { value: 9, key: 6, left: null, right: null },
    // ];
    const bstModelWithoutCoordinate = produceInitialBSTData(initialData);
    const nodeCoordinateByKey = this.getCoordinationsOfTreeNodes(
      bstModelWithoutCoordinate,
    );
    return bstModelWithoutCoordinate.map(item => ({
      ...item,
      ...nodeCoordinateByKey[item.key],
    }));
  }

  componentDidUpdate(prevProps: IProps) {
    const {
      currentStep,
      reverseToStep,
      saveStepSnapshots,
      totalStep,
      updateWhenDataChanges,
      initialData,
    } = this.props;
    const { bstModel } = this.state;

    // Update according to algorithm progression
    if (keyExist(this.props, ['currentStep', 'totalStep', 'instructions'])) {
      switch (
        getProgressDirection(currentStep!, prevProps.currentStep!, totalStep!)
      ) {
        case 'forward':
          saveStepSnapshots(bstModel, currentStep!);
          this.handleForward();
          break;

        case 'backward':
          reverseToStep(currentStep!);
          break;

        case 'fastForward':
          console.log('fastForward');
          this.handleFastForward();
          break;

        case 'fastBackward':
          console.log('fastBackward');
          this.handleFastBackward();
          break;
      }
    }

    // Update according to controlled data
    if (updateWhenDataChanges) {
      if (!isEqual(initialData, prevProps.initialData)) {
        this.setState({ bstModel: this.initBSTModel() });
      }
    }
  }

  handleForward() {
    // Treat each action as a transformation function which take a linkedListModel
    // and return a new one. Consuming multiple actions is merely chaining those
    // transformations together
    // linkedListModel ---- action1 ----> linkedListModel1 ---- action2 ----> linkedListMode2 ---- action3 ----> linkedListModel3
    const { bstModel } = this.state;
    const { currentStep, instructions } = this.props;
    const actionsToMakeAtThisStep = instructions![currentStep];
    if (!actionsToMakeAtThisStep || !actionsToMakeAtThisStep.length) return;
    console.log('actionsToMakeAtThisStep', actionsToMakeAtThisStep);

    // This consume pipeline have many side effect in each step. Each
    // method handle each action has their own side effect
    const newBSTModel = this.consumeMultipleActions(
      actionsToMakeAtThisStep,
      bstModel,
    );
    console.log('newBSTModel', newBSTModel);
    this.setState({ bstModel: newBSTModel });
  }

  consumeMultipleActions(
    actionList: Action<BSTMethod>[],
    currentModel: BSTModel,
    onlyTranformData?: boolean,
  ): BSTModel {
    // Treat each action as a transformation function which take a linkedListModel
    // and return a new one. Consuming multiple actions is merely chaining those
    // transformations together
    // model ---- action1 ----> model1 ---- action2 ----> linkedListMode2 ---- action3 ----> model3
    let finalBSTModel = currentModel;
    actionList.forEach(action => {
      const { name, params } = action;
      if (onlyTranformData) {
        finalBSTModel = transformBSTModel(finalBSTModel, name, params);
      } else {
        // the main function of a handler is doing side effect before transform model
        // a handler must also return a new model
        // if no handler is specify, just transform model right away
        //@ts-ignore
        const customeHandler = this[name];
        if (typeof customeHandler === 'function') {
          finalBSTModel = customeHandler(finalBSTModel, params);
        } else {
          finalBSTModel = transformBSTModel(finalBSTModel, name, params);
        }
      }
    });

    return finalBSTModel;
  }

  getCoordinationsOfTreeNodes(
    bstModelWithoutCoordinate: Omit<BSTNodeModel, 'x' | 'y'>[],
  ): ObjectType<PointCoordinate> {
    // Level order traversal tree and caculate
    const treeHeight = caculateTreeHeight(bstModelWithoutCoordinate);
    let result: ObjectType<PointCoordinate> = {};
    let root = {
      ...bstModelWithoutCoordinate[0],
      ...pick(this.props, ['x', 'y']),
      level: 1,
    };
    let queue: LevelOrderTraversalQueue = [root];
    while (queue.length) {
      const { key, x, y, left, right, level } = queue.shift()!;
      result[key] = { x, y };
      if (left !== null) {
        const leftChild = this.findNodeInTreeByKey(
          bstModelWithoutCoordinate,
          left,
        );
        queue.push({
          ...leftChild!,
          ...caculateChildCoordinate({ x, y }, level + 1, treeHeight, 'left'),
          level: level + 1,
        });
      }

      if (right !== null) {
        const rightChild = this.findNodeInTreeByKey(
          bstModelWithoutCoordinate,
          right,
        );
        queue.push({
          ...rightChild!,
          ...caculateChildCoordinate({ x, y }, level + 1, treeHeight, 'right'),
          level: level + 1,
        });
      }
    }

    return result;
  }

  findNodeInTreeByKey(
    currentModel: Omit<BSTNodeModel, 'x' | 'y'>[],
    nodeKey: number,
  ) {
    return currentModel.find(({ key }) => key === nodeKey)!;
  }

  renderTree() {
    return (
      <>
        {this.renderTreeNode()}
        {this.renderPointerLinkForNode()}
      </>
    );
  }

  renderTreeNode() {
    const { bstModel } = this.state;
    return bstModel.map(node => <GraphMemoryBlock {...node} />);
  }

  renderPointerLinkForNode() {
    const { bstModel, nodeAboutToVisit } = this.state;
    return flatMap(bstModel, node => {
      const { left, right, key, visited } = node;
      const fromNode = this.findNodeCoordinateByKey(bstModel, key);
      const from = {
        x: fromNode.x + GRAPH_NODE_RADIUS,
        y: fromNode.y + GRAPH_NODE_RADIUS,
      };
      return [left, right].map(child => {
        if (!child) return null;
        const toNode = this.findNodeCoordinateByKey(bstModel, child);
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
            visited={visited}
            following={nodeAboutToVisit.has(child)}
            arrowDirection='right'
          />
        );
      });
    });
  }

  findNodeCoordinateByKey(
    currentModel: BSTModel,
    nodeKey: number,
  ): PointCoordinate {
    const treeNode = currentModel.find(({ key }) => key === nodeKey)!;
    return { x: treeNode.x, y: treeNode.y };
  }

  visit = (currentModel: BSTModel, params: [number, number]) => {
    const [nodeKeyToStart, nodeKeyToVisit] = params;
    this.addNodeToVisitingList(nodeKeyToVisit);
    setTimeout(() => {
      this.handleAfterVisitAnimationFinish(
        currentModel,
        nodeKeyToStart,
        nodeKeyToVisit,
      );
    }, 400);

    return currentModel;
  };

  addNodeToVisitingList(nodeKey: number) {
    const { nodeAboutToVisit } = this.state;
    let clonedState = new Set(nodeAboutToVisit);
    clonedState.add(nodeKey);
    this.setState({ nodeAboutToVisit: clonedState });
  }

  handleAfterVisitAnimationFinish(
    currentModel: BSTModel,
    startNodeKey: number,
    nodeKeyToVisit: number,
  ) {
    // Mark the start node as visited and focus to the node which is just visited
    const visitAction: Action<BSTMethod> = {
      name: 'visit',
      params: [startNodeKey],
    };
    const focusAction: Action<BSTMethod> = {
      name: 'focus',
      params: [nodeKeyToVisit],
    };

    const newModel = this.consumeMultipleActions(
      [visitAction, focusAction],
      currentModel,
      true,
    );
    this.setState({ bstModel: newModel });
  }

  // params: [parentKey, valueToInsert]
  insert = (currentModel: BSTModel, params: [number, number]): BSTModel => {
    const [parentKey, valueToInsert] = params;
    const parentNode = currentModel.find(({ key }) => key === parentKey);
    if (!parentNode) return currentModel;

    const parentCoordinate = pick(parentNode, ['x', 'y']);
    const treeHeight = caculateTreeHeight(currentModel);
    const childOrientation =
      valueToInsert > parentNode.value ? 'right' : 'left';
    const childCoordinate = caculateChildCoordinate(
      parentCoordinate,
      treeHeight,
      treeHeight,
      childOrientation,
    );

    // If the new child coordinate collide with existing node in key
    // we must recaculate all coordinate of the tree
    if (isNodeCoordinateCollideWithOtherNode(childCoordinate, currentModel)) {
      const allocatedBSTModel = this.reallocateAllTreeNode(currentModel);
      return this.insert(allocatedBSTModel, params);
    } else {
      const newChildNode = this.constructNewChildNode(
        valueToInsert,
        this.getBiggestKey(currentModel) + 1,
        childCoordinate,
      );
      return transformBSTModel(currentModel, 'insert', [
        parentKey,
        newChildNode,
      ]);
    }
  };

  reallocateAllTreeNode(currentModel: BSTModel) {
    const nodeCoordinateByKey = this.getCoordinationsOfTreeNodes(currentModel);
    return currentModel.map(node => ({
      ...node,
      ...nodeCoordinateByKey[node.key],
    }));
  }

  getBiggestKey(currentModel: BSTModel) {
    return Math.max(...currentModel.map(({ key }) => key));
  }

  constructNewChildNode(
    value: number | string,
    key: number,
    coordinate: PointCoordinate,
  ): BSTNodeModel {
    return {
      value,
      left: null,
      right: null,
      key,
      ...coordinate,
    };
  }

  render() {
    return this.renderTree();
  }
}

export default withReverseStep<BSTModel, PropsWithHoc>(BinarySearchTree);
