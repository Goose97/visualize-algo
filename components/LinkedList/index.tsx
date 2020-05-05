import React, { Component } from 'react';
import produce from 'immer';

import { MemoryBlock, PointerLink } from 'components';
import transformModel from './ModelTransformer';
import HeadPointer from './HeadPointer';
import { promiseSetState } from 'utils';
import { withReverseStep } from 'hocs';
import {
  LinkedListModel,
  LinkedListMethod,
  IProps,
  IState,
  LinkedListNodeModel,
  LinkedListReverseMethod,
} from './index.d';
import { Action } from 'types';
import {
  LINKED_LIST_BLOCK_WIDTH,
  LINKED_LIST_BLOCK_HEIGHT,
} from '../../constants';

export class LinkedList extends Component<IProps, IState> {
  private initialBlockInfo: LinkedListModel;
  private promiseSetState: (state: Record<string, any>) => Promise<undefined>;
  constructor(props: IProps) {
    super(props);

    this.initialBlockInfo = this.initiateMemoryBlockInfo(props);
    this.state = {
      blockInfo: this.initialBlockInfo,
      nodeAboutToAppear: new Set([]),
      isVisible: true,
    };
    this.promiseSetState = promiseSetState.bind(this);
  }

  initiateMemoryBlockInfo(props: IProps): LinkedListModel {
    const { initialData } = props;
    return initialData.map((value, index) => ({
      ...this.caculateBlockCoordinate(index),
      value,
      index,
      visible: true,
      visited: false,
      key: index,
      focus: false,
    }));
  }

  pushReverseAction(actionName: string, params: any[]) {
    const { currentStep, saveReverseLogs } = this.props;
    saveReverseLogs(actionName, params, currentStep);
  }

  componentDidUpdate(prevProps: IProps) {
    const { currentStep, reverseToStep, instructions } = this.props;

    switch (this.getProgressDirection(prevProps.currentStep)) {
      case 'forward':
        const actionsToMakeAtThisStep = instructions[currentStep] || [];
        actionsToMakeAtThisStep.forEach(({ name, params }) =>
          //@ts-ignore
          this[name](...params),
        );
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

  // blockInfo is the single source of truth - all the state of the data structure is hold
  // in this object
  produceNewState(
    action: Action,
    blockInfo = this.state.blockInfo,
  ): LinkedListModel {
    const { name, params } = action;
    switch (name) {
      case 'add': {
        const [value, previousNodeKey, newNodeKey] = params;
        const previousNodeIndex = blockInfo.findIndex(
          ({ key }) => key === previousNodeKey,
        );
        const newNodeData = {
          ...this.caculateBlockCoordinate(previousNodeIndex + 1),
          value,
          index: previousNodeIndex + 1,
          key: newNodeKey,
          visible: true,
        };
        const newBlockInfo = transformModel(blockInfo, 'add', [
          newNodeData,
          previousNodeKey,
        ]);
        return newBlockInfo;
      }

      case 'reverseAdd':
      case 'remove':
      case 'reverseRemove':
      case 'visit':
      case 'reverseVisit':
      case 'focus':
      case 'reverseFocus':
      case 'label':
      case 'reverseLabel':
        return transformModel(blockInfo, name, params);

      default:
        return blockInfo;
    }
  }

  getCurrentFocusNode() {
    const { blockInfo } = this.state;
    const focusNode = blockInfo.find(({ focus }) => !!focus);
    return focusNode ? focusNode.key : null;
  }

  caculateBlockCoordinate(blockIndex: number) {
    const { x: baseX, y: baseY } = this.props;
    return { x: baseX + blockIndex * (2 * LINKED_LIST_BLOCK_WIDTH), y: baseY };
  }

  focus(nodeKey: number) {
    const currentFocusNode = this.getCurrentFocusNode();
    this.pushReverseAction('reverseFocus', [currentFocusNode]);

    const action = {
      name: 'focus',
      params: [nodeKey],
    };
    const newBlockInfo = this.produceNewState(action);
    this.setState({ blockInfo: newBlockInfo });
  }

  label(label: string, nodeKey: number) {
    const { blockInfo } = this.state;
    const nodeToLabel = blockInfo.find(({ key }) => key === nodeKey);
    this.pushReverseAction('reverseLabel', [nodeToLabel?.label, nodeKey]);

    const action = {
      name: 'label',
      params: [label, nodeKey],
    };
    const newBlockInfo = this.produceNewState(action);
    this.setState({ blockInfo: newBlockInfo });
  }

  visit(nodeKey: number) {
    // Nếu node không phải node đầu tiên thì ta sẽ thực thi hàm followLinkToNode
    // Hàm này chịu trách nhiệm thực hiện animation, sau khi animation hoàn thành
    // callbackk handleFinishFollowLink sẽ được thực hiện
    // Nếu node là node đầu tiên thì ta không có animation để thực hiện, focus luôn vào node
    const currentFocusNode = this.getCurrentFocusNode();
    this.pushReverseAction('reverseVisit', [currentFocusNode]);
    if (nodeKey !== 0) {
      this.followLinkToNode(nodeKey);
    } else {
      this.focus(nodeKey);
    }
  }

  followLinkToNode(nodeIndex: number) {
    const { blockInfo } = this.state;
    this.setState({ nodeAboutToVisit: blockInfo[nodeIndex].key });
  }

  handleFinishFollowLink = (startBlockIndex: number) => () => {
    // mark the node who hold the link as visited
    const destinationNodeIndex = this.findNextBlock(
      startBlockIndex,
      true,
    ) as number;
    const action = {
      name: 'visit',
      params: [startBlockIndex],
    };
    this.setState({
      nodeAboutToVisit: undefined,
      blockInfo: this.produceNewState(action),
    });

    // mark the node on the other end as current focus
    this.focus(destinationNodeIndex);
  };

  remove(nodeKey: number) {
    const params = [nodeKey];
    this.pushReverseAction('reverseRemove', params);

    const action = {
      name: 'remove',
      params,
    };
    const newBlockInfo = this.produceNewState(action);
    this.setState({ blockInfo: newBlockInfo });
  }

  add(value: number, previousNodeKey: number, newNodeKey: number) {
    const params = [value, previousNodeKey, newNodeKey];
    this.pushReverseAction('reverseAdd', [value, newNodeKey]);

    const action = {
      name: 'add',
      params,
    };
    let newBlockInfo = this.produceNewState(action);
    // We have to turn off visibility for the new node
    // For the purpose of doing animation
    newBlockInfo = produce(newBlockInfo, draft => {
      let newBlock = draft.find(({ key }) => key === newNodeKey);
      newBlock!.visible = false;
    });
    this.setState({ blockInfo: newBlockInfo });

    this.addOrRemoveNodeAboutToAppear(newNodeKey);
    setTimeout(() => {
      this.toggleNodeVisibility(newNodeKey);
      this.addOrRemoveNodeAboutToAppear(newNodeKey);
    }, 800);
  }

  produceNewBlockInfo(operation: LinkedListMethod, payload: any[]) {
    const { blockInfo } = this.state;
    return transformModel(blockInfo, operation, payload);
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
    const { blockInfo } = this.state;
    const newPosition = produce(blockInfo, draft => {
      const targetBlock = draft.find(({ key }) => key === nodeKey);
      const oldVisibleState = targetBlock!.visible;
      targetBlock!.visible = !oldVisibleState;
    });
    this.setState({ blockInfo: newPosition });
  }

  renderPointerLinkForMemoryBlock(blockIndex: number) {
    const { blockInfo } = this.state;
    const startAndFinish = this.caculateStartAndFinishOfPointer(blockIndex);
    let { visible, visited, key } = blockInfo[blockIndex];
    if (startAndFinish)
      return (
        <PointerLink
          {...startAndFinish}
          following={this.isLinkNeedToBeFollowed(blockIndex)}
          visited={visited}
          visible={visible}
          key={key}
          name={blockInfo[blockIndex].key}
          onFinishFollow={this.handleFinishFollowLink(key)}
        />
      );
  }

  caculateStartAndFinishOfPointer(blockIndex: number) {
    const { blockInfo, nodeAboutToAppear } = this.state;
    let { x, y, visible, key } = blockInfo[blockIndex];
    let nextVisibleBlock = this.findNextBlock(blockIndex);

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
    const { blockInfo, nodeAboutToAppear } = this.state;
    for (let i = index + 1; i < blockInfo.length; i++) {
      const { visible, key } = blockInfo[i];
      if (visible || nodeAboutToAppear.has(key)) {
        return getIndex ? i : blockInfo[i];
      }
    }
  }

  handleReverse = (actionName: LinkedListReverseMethod, params: any[]) => {
    const action = {
      name: actionName,
      params,
    };
    this.promiseSetState({ blockInfo: this.produceNewState(action) });
  };

  handleFastForward() {
    const { blockInfo } = this.state;
    const { instructions } = this.props;

    const allActions = instructions
      .reduce((acc, instruction) => acc.concat(instruction), [])
      .map(instruction => {
        const { name, params } = instruction;
        return name === 'visit' ? { name: 'focus', params } : instruction;
      });
    let finalBlockInfo = blockInfo;
    for (let i = 0; i < allActions.length; i++) {
      finalBlockInfo = this.produceNewState(allActions[i], finalBlockInfo);
    }

    this.updateWithoutAnimation(finalBlockInfo);
  }

  handleFastBackward() {
    this.updateWithoutAnimation(this.initialBlockInfo);
  }

  updateWithoutAnimation(newBlockInfo: LinkedListModel) {
    this.setState({ blockInfo: newBlockInfo, isVisible: false }, () =>
      this.setState({ isVisible: true }),
    );
  }

  render() {
    const { blockInfo, isVisible } = this.state;
    const listMemoryBlock = blockInfo.map(blockInfo => (
      <MemoryBlock {...blockInfo} name={blockInfo.key} />
    ));

    const listPointerLink = blockInfo
      .slice(0, -1)
      .map((_, index) => this.renderPointerLinkForMemoryBlock(index));

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
