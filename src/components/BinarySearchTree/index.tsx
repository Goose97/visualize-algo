import React, { Component } from 'react';
import { flatMap, pick } from 'lodash';

import { GraphMemoryBlock, GraphLikeEdges } from 'components';
import BinarySearchTreeHTML from './BinarySearchTreeHTML';
import withDSCore, { WithDSCore } from 'hocs/withDSCore';
import { IProps, IState, LevelOrderTraversalQueue } from './index.d';
import { BST } from 'types/ds/BST';
import transformBSTModel from 'transformers/BST';
import {
  caculateTreeHeight,
  caculateChildCoordinate,
  isNodeCoordinateCollideWithOtherNode,
  produceInitialBSTData,
} from './helper';
import { ObjectType, PointCoordinate, Action } from 'types';

type PropsWithHoc = IProps & WithDSCore<BST.Model>;

export class BinarySearchTreeDS extends Component<PropsWithHoc, IState> {
  private wrapperRef: React.RefObject<SVGUseElement>;

  constructor(props: PropsWithHoc) {
    super(props);
    this.state = {
      nodeAboutToVisit: new Set([]),
    };
    this.wrapperRef = React.createRef();

    // Register custom transformer
    props.registerCustomTransformer({
      visit: this.visit,
      insert: this.insert,
    });

    // Register HTML injector
    props.registerHTMLInjector(this.injectHTMLIntoCanvas);
  }

  static initBSTModel(props: IProps): BST.Model {
    const { controlled, data, initialData } = props;
    const dataToInitBST = controlled ? data : initialData;
    const bstModelWithoutCoordinate = produceInitialBSTData(dataToInitBST);
    const nodeCoordinateByKey = BinarySearchTreeDS.getCoordinationsOfTreeNodes(
      bstModelWithoutCoordinate,
      props,
    );
    return bstModelWithoutCoordinate.map(item => ({
      ...item,
      ...nodeCoordinateByKey[item.key],
      visible: true,
    }));
  }

  static getCoordinationsOfTreeNodes(
    bstModelWithoutCoordinate: Omit<BST.NodeModel, 'x' | 'y'>[],
    props: IProps,
  ): ObjectType<PointCoordinate> {
    // Level order traversal tree and caculate
    const treeHeight = caculateTreeHeight(bstModelWithoutCoordinate);
    let result: ObjectType<PointCoordinate> = {};
    let root = {
      ...bstModelWithoutCoordinate[0],
      ...pick(props, ['x', 'y']),
      x: 0,
      y: 0,
      level: 1,
    };
    let queue: LevelOrderTraversalQueue = [root];
    while (queue.length) {
      const { key, x, y, left, right, level } = queue.shift()!;
      result[key] = { x, y };
      if (left !== null) {
        const leftChild = BinarySearchTreeDS.findNodeInTreeByKey(
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
        const rightChild = BinarySearchTreeDS.findNodeInTreeByKey(
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

    // Some coordination will have negative x value
    // we have to shift all coordination to right to make sure they start at 0
    const allXValue = Object.values(result).map(({ x }) => x);
    let amountToShiftToRight = -Math.min(...allXValue, 0);
    Object.values(result).forEach(coordinate => {
      coordinate.x += amountToShiftToRight;
    });
    return result;
  }

  static findNodeInTreeByKey(
    currentModel: Omit<BST.NodeModel, 'x' | 'y'>[],
    nodeKey: number,
  ) {
    return currentModel.find(({ key }) => key === nodeKey)!;
  }

  consumeMultipleActions(
    actionList: Action<BST.Method>[],
    currentModel: BST.Model,
    onlyTranformData?: boolean,
  ): BST.Model {
    // Treat each action as a transformation function which take a linkedListModel
    // and return a new one. Consuming multiple actions is merely chaining those
    // transformations together
    // linkedListModel ---- action1 ----> linkedListModel1 ---- action2 ----> linkedListMode2 ---- action3 ----> linkedListModel3
    return actionList.reduce<BST.Model>((finalModel, action) => {
      // the main function of a handler is doing side effect before transform model
      // a handler must also return a new model
      // if no handler is specify, just transform model right away
      const { name, params } = action;
      //@ts-ignore
      const customHandler = this[name];

      if (typeof customHandler === 'function') {
        return customHandler(finalModel, params, onlyTranformData);
      } else {
        return transformBSTModel(finalModel, name, params);
      }
    }, currentModel);
  }

  visit = (currentModel: BST.Model, params: [number, number]) => {
    const [nodeKeyToStart, nodeKeyToVisit] = params;
    this.addNodeToVisitingList(nodeKeyToVisit);
    setTimeout(() => {
      this.handleAfterVisitAnimationFinish(
        currentModel,
        nodeKeyToStart,
        nodeKeyToVisit,
      );
    }, 800);

    return currentModel;
  };

  addNodeToVisitingList(nodeKey: number) {
    const { nodeAboutToVisit } = this.state;
    let clonedState = new Set(nodeAboutToVisit);
    clonedState.add(nodeKey);
    this.setState({ nodeAboutToVisit: clonedState });
  }

  handleAfterVisitAnimationFinish(
    currentModel: BST.Model,
    startNodeKey: number,
    nodeKeyToVisit: number,
  ) {
    const { nodeAboutToVisit } = this.state;
    const { updateModel } = this.props;
    const clonedState = new Set(nodeAboutToVisit);
    clonedState.delete(nodeKeyToVisit);

    // Mark the start node as visited and focus to the node which is just visited
    const visitAction: Action<BST.Method> = {
      name: 'visited',
      params: [startNodeKey],
    };
    const focusAction: Action<BST.Method> = {
      name: 'focus',
      params: [nodeKeyToVisit],
    };

    const newModel = this.consumeMultipleActions(
      [visitAction, focusAction],
      currentModel,
      true,
    );
    this.setState({ nodeAboutToVisit: clonedState });
    updateModel(newModel);
  }

  // params: [parentKey, valueToInsert]
  insert = (
    currentModel: BST.Model,
    params: [number, number | string],
  ): BST.Model => {
    const [parentKey, valueToInsert] = params;
    const parentNode = currentModel.find(({ key }) => key === parentKey);
    if (parentNode == null) return currentModel;

    const parentCoordinate = pick(parentNode, ['x', 'y']);
    const treeHeight = caculateTreeHeight(currentModel);
    const childOrientation =
      //@ts-ignore
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
    }

    const newChildNode = this.constructNewChildNode(
      valueToInsert,
      this.getBiggestKey(currentModel) + 1,
      childCoordinate,
    );
    const modelAfterInsert = transformBSTModel(currentModel, 'insert', [
      parentKey,
      newChildNode,
    ]);
    if (this.isTreeOutOfView(modelAfterInsert))
      return this.shiftTreeToView(modelAfterInsert);

    return modelAfterInsert;
  };

  isTreeOutOfView(bstModel: BST.Model) {
    return bstModel.some(({ x }) => x < 0);
  }

  // Sometimes node in bst will have negative x value
  // so we have to shift the whole tree to right some amount to make
  // the whole tree visible
  shiftTreeToView(bstModel: BST.Model) {
    let amountToShiftRight = Math.min(...bstModel.map(({ x }) => x));
    if (amountToShiftRight > 0) return bstModel;
    return bstModel.map(item => ({ ...item, x: item.x - amountToShiftRight }));
  }

  reallocateAllTreeNode(currentModel: BST.Model) {
    const nodeCoordinateByKey = BinarySearchTreeDS.getCoordinationsOfTreeNodes(
      currentModel,
      this.props,
    );
    return currentModel.map(node => ({
      ...node,
      ...nodeCoordinateByKey[node.key],
    }));
  }

  getBiggestKey(currentModel: BST.Model) {
    return Math.max(...currentModel.map(({ key }) => key));
  }

  constructNewChildNode(
    value: number | string,
    key: number,
    coordinate: PointCoordinate,
  ): BST.NodeModel {
    return {
      value,
      left: null,
      right: null,
      key,
      visible: true,
      isNew: true,
      ...coordinate,
    };
  }

  // handleFastForward() {
  //   const { bstModel } = this.state;
  //   const { instructions, saveStepSnapshots } = this.props;
  //   if (!instructions) return;

  //   let allActions: ActionWithStep<BST.Method>[] = [];
  //   for (let i = 0; i < instructions.length; i++) {
  //     // Replace visit action with vist + focus
  //     // also add step attribute to each action
  //     const replacedActions: ActionWithStep<BST.Method>[] = flatMap(
  //       instructions[i],
  //       action => {
  //         const { name, params } = action;
  //         return name === 'visit'
  //           ? [
  //               { name: 'visited', params: params.slice(0, 1), step: i },
  //               { name: 'focus', params: params.slice(1), step: i },
  //             ]
  //           : { ...action, step: i };
  //       },
  //     );

  //     allActions.push(...replacedActions);
  //   }

  //   const actionsGroupedByStep = groupBy(allActions, item => item.step);

  //   // Loop through all the action one by one and keep updating the final model
  //   let finalLinkedListModel = Object.entries(actionsGroupedByStep).reduce<
  //     BST.Model
  //   >((currentModel, [step, actionsToMakeAtThisStep]) => {
  //     saveStepSnapshots(currentModel, +step);
  //     return this.consumeMultipleActions(
  //       actionsToMakeAtThisStep,
  //       currentModel,
  //       true,
  //     );
  //   }, bstModel);
  //   this.updateWithoutAnimation(finalLinkedListModel);
  // }

  renderNodes() {
    const { model } = this.props;
    return model.map(node => <GraphMemoryBlock {...node} />);
  }

  renderPointerLinks() {
    const { model } = this.props;
    const { nodeAboutToVisit } = this.state;
    return flatMap(model, node => {
      const { left, right, key, visited } = node;
      const fromNode = this.findNodeCoordinateByKey(model, key);

      return [left, right].map(child => {
        if (!child) return null;
        const {
          visited: childVisited,
        } = BinarySearchTreeDS.findNodeInTreeByKey(model, child);
        const toNode = this.findNodeCoordinateByKey(model, child);

        return (
          <GraphLikeEdges
            // {...pathAndRotation}
            from={pick(fromNode, ['x', 'y'])}
            to={pick(toNode, ['x', 'y'])}
            key={child}
            visible={!!this.isNodeVisible(model, child)}
            visited={visited && childVisited}
            following={nodeAboutToVisit.has(child)}
            arrowDirection='right'
          />
        );
      });
    });
  }

  findNodeCoordinateByKey(
    currentModel: BST.Model,
    nodeKey: number,
  ): PointCoordinate {
    const treeNode = currentModel.find(({ key }) => key === nodeKey)!;
    return { x: treeNode.x, y: treeNode.y };
  }

  isNodeVisible(currentModel: BST.Model, nodeKey: number) {
    return !!currentModel.find(({ key }) => key === nodeKey)?.visible;
  }

  injectHTMLIntoCanvas = () => {
    const { handleExecuteApi, dropdownDisabled, model } = this.props;
    setTimeout(() => {
      BinarySearchTreeHTML.renderToView({
        model,
        wrapperElement: this.wrapperRef.current,
        coordinate: pick(this.props, ['x', 'y']),
        apiHandler: handleExecuteApi,
        disabled: dropdownDisabled,
      });
    }, 0);
  };

  render() {
    return (
      <>
        <use
          href='#binary-search-tree'
          {...pick(this.props, ['x', 'y'])}
          ref={this.wrapperRef}
        />
        <defs>
          <g id='binary-search-tree' x='0' y='0'>
            {this.renderPointerLinks()}
            {this.renderNodes()}
          </g>
        </defs>
      </>
    );
  }
}

export default withDSCore<BST.Model, BST.Method>({
  initModel: BinarySearchTreeDS.initBSTModel,
  dataTransformer: transformBSTModel,
  //@ts-ignore
})(BinarySearchTreeDS);
