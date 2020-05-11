import React, { Component } from 'react';
import produce from 'immer';
import { pick, omit } from 'lodash';

import { AutoTransformGroup } from 'components';
import transformModel from './ModelTransformer';
import HeadPointer from './HeadPointer';
import LinkedListMemoryBlock from './LinkedListMemoryBlock';
import LinkedListPointer from './LinkedListPointer';
import { promiseSetState } from 'utils';
import { withReverseStep } from 'hocs';
import {
  LinkedListModel,
  IProps,
  IState,
  LinkedListNodeModel,
  LinkedListReverseMethod,
  LinkedListDataStructure,
} from './index.d';
import { Action } from 'types';
import {
  LINKED_LIST_BLOCK_WIDTH,
  LINKED_LIST_BLOCK_HEIGHT,
} from '../../constants';

export class LinkedList extends Component<IProps, IState>
  implements LinkedListDataStructure {
  private initialLinkedListModel: LinkedListModel;
  private promiseSetState: (state: Record<string, any>) => Promise<undefined>;

  constructor(props: IProps) {
    super(props);

    this.initialLinkedListModel = this.initiateMemoryLinkedListModel(props);
    this.state = {
      linkedListModel: this.initialLinkedListModel,
      nodeAboutToAppear: new Set([]),
      isVisible: true,
    };
    this.promiseSetState = promiseSetState.bind(this);
  }

  initiateMemoryLinkedListModel(props: IProps): LinkedListModel {
    const { initialData } = props;
    return initialData.map((value, index) => ({
      ...this.caculateBlockCoordinate(index),
      value,
      index,
      visible: true,
      visited: false,
      key: index,
      focus: false,
      pointer: index === initialData.length - 1 ? null : index + 1,
    }));
  }

  pushReverseAction(actionName: string, params: any[]) {
    const { currentStep, saveReverseLogs } = this.props;
    saveReverseLogs(actionName, params, currentStep);
  }

  componentDidUpdate(prevProps: IProps) {
    const { currentStep, reverseToStep } = this.props;

    switch (this.getProgressDirection(prevProps.currentStep)) {
      case 'forward':
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
    const { linkedListModel } = this.state;
    const { currentStep, instructions } = this.props;
    const actionsToMakeAtThisStep = instructions[currentStep];
    if (!actionsToMakeAtThisStep || !actionsToMakeAtThisStep.length) return;

    // This consume pipeline have many side effect in each step. Each
    // method handle each action has their own side effect
    const newLinkedListModel = this.consumeMultipleActions(
      actionsToMakeAtThisStep,
      linkedListModel,
    );
    this.setState({ linkedListModel: newLinkedListModel });
  }

  consumeMultipleActions(
    actionList: Action[],
    currentModel: LinkedListModel,
  ): LinkedListModel {
    // Treat each action as a transformation function which take a linkedListModel
    // and return a new one. Consuming multiple actions is merely chaining those
    // transformations together
    // linkedListModel ---- action1 ----> linkedListModel1 ---- action2 ----> linkedListMode2 ---- action3 ----> linkedListModel3
    let finalLinkedListModel = currentModel;
    actionList.forEach(({ name, params }) => {
      //@ts-ignore
      finalLinkedListModel = this[name](finalLinkedListModel, params);
    });

    return finalLinkedListModel;
  }

  getProgressDirection(previousStep: number) {
    const { totalStep, currentStep } = this.props;
    if (previousStep === undefined) return 'forward';
    if (currentStep === previousStep) return 'stay';
    if (currentStep > previousStep) {
      if (currentStep - previousStep === 1) return 'forward';
      else if (currentStep === totalStep) return 'fastForward';
    } else {
      if (previousStep - currentStep === 1) return 'backward';
      else if (currentStep === 0) return 'fastBackward';
    }
  }

  // linkedListModel is the single source of truth - all the state of the data structure is hold
  // in this object
  produceNewState(
    oldLinkedListModel: LinkedListModel,
    action: Action,
  ): LinkedListModel {
    const { name, params } = action;
    switch (name) {
      case 'add': {
        const [value, previousNodeKey, newNodeKey] = params;
        const previousNodeIndex = oldLinkedListModel.findIndex(
          ({ key }) => key === previousNodeKey,
        );
        const newNodeData = {
          ...this.caculateBlockCoordinate(previousNodeIndex + 1),
          value,
          index: previousNodeIndex + 1,
          key: newNodeKey,
          visible: true,
        };
        const newLinkedListModel = transformModel(oldLinkedListModel, 'add', [
          newNodeData,
          previousNodeKey,
        ]);
        return newLinkedListModel;
      }

      case 'reverseAdd':
      case 'remove':
      case 'reverseRemove':
      case 'visit':
      case 'reverseVisit':
      case 'focus':
      case 'reverseFocus':
      case 'label':
      case 'changePointer':
        return transformModel(oldLinkedListModel, name, params);

      default:
        return oldLinkedListModel;
    }
  }

  getCurrentFocusNode() {
    const { linkedListModel } = this.state;
    const focusNode = linkedListModel.find(({ focus }) => !!focus);
    return focusNode ? focusNode.key : null;
  }

  caculateBlockCoordinate(nodeIndex: number) {
    const { x: baseX, y: baseY } = this.props;
    return { x: baseX + nodeIndex * (2 * LINKED_LIST_BLOCK_WIDTH), y: baseY };
  }

  focus(currentModel: LinkedListModel, params: [number]) {
    const currentFocusNode = this.getCurrentFocusNode();
    this.pushReverseAction('reverseFocus', [currentFocusNode]);

    const action = {
      name: 'focus',
      params,
    };
    return this.produceNewState(currentModel, action);
  }

  // params: label, nodeKey, removeThisLabelInOtherNode
  label(currentModel: LinkedListModel, params: [string, number, boolean]) {
    const { linkedListModel } = this.state;
    const [_, nodeKey, __] = params;
    const nodeToLabel = linkedListModel.find(({ key }) => key === nodeKey);
    this.pushReverseAction('label', [nodeToLabel?.label, nodeKey]);

    const action = {
      name: 'label',
      params,
    };
    return this.produceNewState(currentModel, action);
  }

  // params: pointFrom, pointTo
  changePointer(
    currentModel: LinkedListModel,
    params: [number, number | null],
  ) {
    const [pointFrom] = params;
    const nodeHolderPointer = currentModel.find(({ key }) => key === pointFrom);
    const oldPointTo = nodeHolderPointer && nodeHolderPointer.pointer;
    this.pushReverseAction('changePointer', [pointFrom, oldPointTo]);

    const action = {
      name: 'changePointer',
      params,
    };
    return this.produceNewState(currentModel, action);
  }

  visit(currentModel: LinkedListModel, params: [number]) {
    // Nếu node không phải node đầu tiên thì ta sẽ thực thi hàm followLinkToNode
    // Hàm này chịu trách nhiệm thực hiện animation, sau khi animation hoàn thành
    // callbackk handleFinishFollowLink sẽ được thực hiện
    // Nếu node là node đầu tiên thì ta không có animation để thực hiện, focus luôn vào node
    const [nodeKey] = params;
    const currentFocusNode = this.getCurrentFocusNode();
    this.pushReverseAction('reverseVisit', [currentFocusNode]);
    if (nodeKey !== 0) {
      this.followLinkToNode(nodeKey);
      setTimeout(() => {
        this.handleFinishFollowLink(currentFocusNode, nodeKey);
      }, 400);
    } else {
      this.focus(currentModel, [nodeKey]);
    }

    return currentModel;
  }

  followLinkToNode(nodeIndex: number) {
    const { linkedListModel } = this.state;
    this.setState({ nodeAboutToVisit: linkedListModel[nodeIndex].key });
  }

  handleFinishFollowLink = (
    startNodeKey: number | null,
    destinationNodeKey: number,
  ) => {
    // mark the node who hold the link as visited
    const { linkedListModel } = this.state;
    let newLinkedListModel = linkedListModel;
    if (typeof startNodeKey === 'number') {
      const action = {
        name: 'visit',
        params: [startNodeKey],
      };
      newLinkedListModel = this.produceNewState(newLinkedListModel, action);
    }

    // mark the node on the other end as current focus
    newLinkedListModel = this.focus(newLinkedListModel, [destinationNodeKey]);

    this.setState({
      nodeAboutToVisit: undefined,
      linkedListModel: newLinkedListModel,
    });
  };

  remove(currentModel: LinkedListModel, params: [number]) {
    this.pushReverseAction('reverseRemove', params);
    const action = {
      name: 'remove',
      params,
    };
    return this.produceNewState(currentModel, action);
  }

  add(currentModel: LinkedListModel, params: [number, number, number]) {
    const [value, _, newNodeKey] = params;
    this.pushReverseAction('reverseAdd', [value, newNodeKey]);

    const action = {
      name: 'add',
      params,
    };
    let newLinkedListModel = this.produceNewState(currentModel, action);
    // We have to turn off visibility for the new node
    // For the purpose of doing animation
    newLinkedListModel = produce(newLinkedListModel, draft => {
      let newBlock = draft.find(({ key }) => key === newNodeKey);
      newBlock!.visible = false;
    });
    // this.setState({ linkedListModel: newLinkedListModel });

    this.addOrRemoveNodeAboutToAppear(newNodeKey);
    setTimeout(() => {
      this.toggleNodeVisibility(newNodeKey);
      this.addOrRemoveNodeAboutToAppear(newNodeKey);
    }, 800);

    return newLinkedListModel;
  }

  // nodeAboutToAppear is a list of node which already in the state
  // but about to get animated to appear
  addOrRemoveNodeAboutToAppear(nodeKey: number) {
    const { nodeAboutToAppear } = this.state;
    if (nodeAboutToAppear.has(nodeKey)) {
      const cloneState = new Set(nodeAboutToAppear);
      cloneState.delete(nodeKey);
      this.setState({ nodeAboutToAppear: cloneState });
    } else {
      this.setState({
        nodeAboutToAppear: nodeAboutToAppear.add(nodeKey),
      });
    }
  }

  toggleNodeVisibility(nodeKey: number) {
    const { linkedListModel } = this.state;
    const newPosition = produce(linkedListModel, draft => {
      const targetBlock = draft.find(({ key }) => key === nodeKey);
      const oldVisibleState = targetBlock!.visible;
      targetBlock!.visible = !oldVisibleState;
    });
    this.setState({ linkedListModel: newPosition });
  }

  renderPointerLinkForMemoryBlock(nodeIndex: number) {
    const { linkedListModel, nodeAboutToAppear } = this.state;
    const { key, pointer, visible, visited } = linkedListModel[nodeIndex];
    return (
      <LinkedListPointer
        nodeAboutToAppear={nodeAboutToAppear}
        from={key}
        to={pointer}
        linkedListModel={linkedListModel}
        following={this.isLinkNeedToBeFollowed(nodeIndex)}
        visited={visited}
        visible={visible}
      />
    );
  }

  caculateStartAndFinishOfPointer(nodeIndex: number) {
    const { linkedListModel, nodeAboutToAppear } = this.state;
    let { x, y, visible, key, pointer } = linkedListModel[nodeIndex];
    let nextVisibleBlock = pointer ? this.findNodeByKey(pointer) : null;

    const start = {
      x: x + LINKED_LIST_BLOCK_WIDTH - 10,
      y: y + LINKED_LIST_BLOCK_HEIGHT / 2,
    };
    let finish;
    if (nextVisibleBlock && visible) {
      let { x: x1, y: y1 } = nextVisibleBlock as LinkedListNodeModel;

      if (nodeAboutToAppear.has(key)) {
        finish = { ...start };
      } else {
        finish = { x: x1, y: y1 + LINKED_LIST_BLOCK_HEIGHT / 2 };
      }
      return { start, finish };
    } else {
      return null;
    }
  }

  findNodeByKey(key: number) {
    const { linkedListModel } = this.state;
    const nodeWithKey = linkedListModel.find(
      ({ key: nodeKey }) => key === nodeKey,
    );
    return nodeWithKey || null;
  }

  // Start block is the block which hold the link and point to another block
  isLinkNeedToBeFollowed(startBlockIndex: number) {
    const { nodeAboutToVisit } = this.state;
    const nextVisibleBlock = this.findNextBlock(startBlockIndex) as
      | LinkedListNodeModel
      | undefined;
    return nextVisibleBlock && nextVisibleBlock.key === nodeAboutToVisit;
  }

  // Find block which is still visible or in about to appear state
  findNextBlock(index: number, getIndex = false) {
    const { linkedListModel, nodeAboutToAppear } = this.state;
    for (let i = index + 1; i < linkedListModel.length; i++) {
      const { visible, key } = linkedListModel[i];
      if (visible || nodeAboutToAppear.has(key)) {
        return getIndex ? i : linkedListModel[i];
      }
    }
  }

  handleReverse = (actionName: LinkedListReverseMethod, params: any[]) => {
    const { linkedListModel } = this.state;
    const action = {
      name: actionName,
      params,
    };
    this.promiseSetState({
      linkedListModel: this.produceNewState(linkedListModel, action),
    });
  };

  handleFastForward() {
    const { linkedListModel } = this.state;
    const { instructions } = this.props;

    const allActions = instructions
      .reduce((acc, instruction) => acc.concat(instruction), [])
      .map(instruction => {
        const { name, params } = instruction;
        return name === 'visit' ? { name: 'focus', params } : instruction;
      });
    let finalLinkedListModel = linkedListModel;
    for (let i = 0; i < allActions.length; i++) {
      finalLinkedListModel = this.produceNewState(
        finalLinkedListModel,
        allActions[i],
      );
    }

    this.updateWithoutAnimation(finalLinkedListModel);
  }

  handleFastBackward() {
    this.updateWithoutAnimation(this.initialLinkedListModel);
  }

  updateWithoutAnimation(newLinkedListModel: LinkedListModel) {
    this.setState(
      { linkedListModel: newLinkedListModel, isVisible: false },
      () => this.setState({ isVisible: true }),
    );
  }

  render() {
    const { linkedListModel, isVisible } = this.state;
    const listMemoryBlock = linkedListModel.map(linkedListNode => (
      <AutoTransformGroup
        origin={pick(linkedListNode, ['x', 'y'])}
        key={linkedListNode.key}
      >
        <LinkedListMemoryBlock {...omit(linkedListNode, ['key'])} />
      </AutoTransformGroup>
    ));
    const listPointerLink = linkedListModel.map((_, index) =>
      this.renderPointerLinkForMemoryBlock(index),
    );

    return (
      isVisible && (
        <g>
          <HeadPointer headBlock={this.findNextBlock(-1)} />
          {listMemoryBlock}
          {listPointerLink}
        </g>
      )
    );
  }
}

export default withReverseStep(LinkedList);
