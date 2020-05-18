import React, { Component } from 'react';
import { flatMap, pick } from 'lodash';

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
import { getProgressDirection } from 'utils';
import {
  caculateTreeHeight,
  caculateChildCoordinate,
  caculatePointerPathFromTwoNodeCenter,
} from './helper';
import { ObjectType, PointCoordinate, Action } from 'types';
import { GRAPH_NODE_RADIUS } from '../../constants';

type PropsWithHoc = IProps & WithReverseStep<BSTModel>;

export class BinarySearchTree extends Component<PropsWithHoc, IState> {
  private treeHeight: number;

  constructor(props: PropsWithHoc) {
    super(props);
    this.state = {
      nodeAboutToVisit: new Set([]),
      bstModel: this.initBSTModel(),
    };

    this.treeHeight = caculateTreeHeight(this.state.bstModel.length);
  }

  initBSTModel() {
    const { initialData } = this.props;
    return [
      { value: 4, key: 0, left: 1, right: 2 },
      { value: 1, key: 1, left: 3, right: 4 },
      { value: 8, key: 2, left: 5, right: 6 },
      { value: 0, key: 3, left: null, right: null },
      { value: 2, key: 4, left: null, right: null },
      { value: 6, key: 5, left: null, right: null },
      { value: 9, key: 6, left: null, right: null },
    ];
  }

  componentDidUpdate(prevProps: IProps) {
    const {
      currentStep,
      reverseToStep,
      saveStepSnapshots,
      totalStep,
    } = this.props;
    const { bstModel } = this.state;

    switch (
      getProgressDirection(currentStep, prevProps.currentStep, totalStep)
    ) {
      case 'forward':
        saveStepSnapshots(bstModel, currentStep);
        this.handleForward();
        break;

      case 'backward':
        reverseToStep(currentStep);
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

  handleForward() {
    // Treat each action as a transformation function which take a linkedListModel
    // and return a new one. Consuming multiple actions is merely chaining those
    // transformations together
    // linkedListModel ---- action1 ----> linkedListModel1 ---- action2 ----> linkedListMode2 ---- action3 ----> linkedListModel3
    const { bstModel } = this.state;
    const { currentStep, instructions } = this.props;
    const actionsToMakeAtThisStep = instructions[currentStep];
    if (!actionsToMakeAtThisStep || !actionsToMakeAtThisStep.length) return;
    console.log('actionsToMakeAtThisStep', actionsToMakeAtThisStep);

    // This consume pipeline have many side effect in each step. Each
    // method handle each action has their own side effect
    const newBSTModel = this.consumeMultipleActions(
      actionsToMakeAtThisStep,
      bstModel,
    );
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

  getCoordinationsOfTreeNodes(): ObjectType<PointCoordinate> {
    // Level order traversal tree and caculate
    const { bstModel } = this.state;
    let result: ObjectType<PointCoordinate> = {};
    let root = { ...bstModel[0], ...pick(this.props, ['x', 'y']), level: 1 };
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
    const { bstModel } = this.state;
    return bstModel.find(({ key }) => key === nodeKey)!;
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
    const { bstModel, nodeAboutToVisit } = this.state;
    return flatMap(bstModel, node => {
      const { left, right, key, visited } = node;
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
            visited={visited}
            following={nodeAboutToVisit.has(child)}
            arrowDirection='right'
          />
        );
      });
    });
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

  render() {
    return this.renderTree();
  }
}

export default withReverseStep<BSTModel, PropsWithHoc>(BinarySearchTree);
