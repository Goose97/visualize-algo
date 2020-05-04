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
} from './index.d';
import { Action } from 'types';
import {
  LINKED_LIST_BLOCK_WIDTH,
  LINKED_LIST_BLOCK_HEIGHT,
} from '../../constants';

export class LinkedList extends Component<IProps, IState> {
  private initialBlockInfo: LinkedListModel;
  private key: number;
  private promiseSetState: (state: Record<string, any>) => Promise<undefined>;
  constructor(props: IProps) {
    super(props);

    this.initialBlockInfo = this.initiateMemoryBlockInfo(props);
    this.state = {
      blockInfo: this.initialBlockInfo,
      nodeAboutToAppear: new Set([]),
      isVisible: true,
    };
    this.key = this.state.blockInfo.length;
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
      case 'addNode': {
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
        const newBlockInfo = transformModel(blockInfo, 'add', {
          nodeData: newNodeData,
          previousNodeKey,
        });
        return newBlockInfo;
      }

      case 'reverseAddNode': {
        const [value, nodeKey] = params;
        const newBlockInfo = transformModel(blockInfo, 'reverseAdd', {
          key: nodeKey,
          value,
        });
        return newBlockInfo;
      }

      case 'removeNode': {
        const [key] = params;
        const newBlockInfo = transformModel(blockInfo, 'remove', {
          key,
        });
        return newBlockInfo;
      }

      case 'reverseRemoveNode': {
        const [index] = params;
        const newBlockInfo = transformModel(blockInfo, 'reverseRemove', {
          index,
        });
        return newBlockInfo;
      }

      case 'visitNode': {
        return blockInfo;
      }

      case 'focusNode': {
        const [key] = params;
        const newBlockInfo = transformModel(blockInfo, 'focus', {
          key,
        });
        return newBlockInfo;
      }

      case 'labelNode': {
        const [label, key] = params;
        const newBlockInfo = transformModel(blockInfo, 'label', {
          label,
          key,
        });
        return newBlockInfo;
      }

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

  focusNode(nodeKey: number) {
    const currentFocusNode = this.getCurrentFocusNode();
    this.pushReverseAction('reverseFocusNode', [currentFocusNode]);

    const action = {
      name: 'focusNode',
      params: [nodeKey],
    };
    const newBlockInfo = this.produceNewState(action);
    this.setState({ blockInfo: newBlockInfo });
  }

  labelNode(label: string, nodeKey: number) {
    const { blockInfo } = this.state;
    const nodeToLabel = blockInfo.find(({ key }) => key === nodeKey);
    this.pushReverseAction('reverseLabelNode', [nodeToLabel?.label, nodeKey]);

    const action = {
      name: 'labelNode',
      params: [label, nodeKey],
    };
    const newBlockInfo = this.produceNewState(action);
    this.setState({ blockInfo: newBlockInfo });
  }

  visitNode(nodeKey: number) {
    // Nếu node không phải node đầu tiên thì ta sẽ thực thi hàm followLinkToNode
    // Hàm này chịu trách nhiệm thực hiện animation, sau khi animation hoàn thành
    // callbackk handleFinishFollowLink sẽ được thực hiện
    // Nếu node là node đầu tiên thì ta không có animation để thực hiện, focus luôn vào node
    const currentFocusNode = this.getCurrentFocusNode();
    this.pushReverseAction('reverseVisitNode', [currentFocusNode]);
    if (nodeKey !== 0) {
      this.followLinkToNode(nodeKey);
    } else {
      this.focusNode(nodeKey);
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
    this.setState({
      nodeAboutToVisit: undefined,
      blockInfo: this.produceNewBlockInfo('visit', {
        index: startBlockIndex,
      }),
    });

    // mark the node on the other end as current focus
    this.focusNode(destinationNodeIndex);
  };

  removeNode(nodeKey: number) {
    const params = [nodeKey];
    this.pushReverseAction('reverseRemoveNode', params);

    const action = {
      name: 'removeNode',
      params,
    };
    const newBlockInfo = this.produceNewState(action);
    this.setState({ blockInfo: newBlockInfo });
  }

  addNode(value: number, previousNodeKey: number, newNodeKey: number) {
    const params = [value, previousNodeKey, newNodeKey];
    this.pushReverseAction('reverseAddNode', [value, newNodeKey]);

    const action = {
      name: 'addNode',
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

  produceNewBlockInfo(operation: LinkedListMethod, payload: Object) {
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

  reverseAddNode = (value: number, nodeKey: number) => {
    const action = {
      name: 'reverseAddNode',
      params: [value, nodeKey],
    };
    const newBlockInfo = this.produceNewState(action);
    this.promiseSetState({ blockInfo: newBlockInfo });
  };

  reverseRemoveNode = (nodeKey: number) => {
    const action = {
      name: 'reverseRemoveNode',
      params: [nodeKey],
    };
    const newBlockInfo = this.produceNewState(action);
    this.promiseSetState({ blockInfo: newBlockInfo });
  };

  // TODO need change
  reverseVisitNode = (nodeKey: number) => {
    const newBlockInfo = this.produceNewBlockInfo('reverseVisit', {
      key: nodeKey,
    });
    this.promiseSetState({ blockInfo: newBlockInfo });
  };

  reverseFocusNode = (previousFocusNodeKey: number) => {
    const newBlockInfo = this.produceNewBlockInfo('reverseFocus', {
      key: previousFocusNodeKey,
    });
    return this.promiseSetState({ blockInfo: newBlockInfo });
  };

  reverseLabelNode = (oldLabel: string | undefined, nodeKey: number) => {
    const newBlockInfo = this.produceNewBlockInfo('label', {
      key: nodeKey,
      label: oldLabel,
    });
    return this.promiseSetState({ blockInfo: newBlockInfo });
  };

  handleFastForward() {
    const { blockInfo } = this.state;
    const { instructions } = this.props;

    const allActions = instructions
      .reduce((acc, instruction) => acc.concat(instruction), [])
      .map(instruction => {
        const { name, params } = instruction;
        return name === 'visitNode'
          ? { name: 'focusNode', params }
          : instruction;
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
